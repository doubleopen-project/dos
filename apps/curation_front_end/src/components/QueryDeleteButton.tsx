// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { userHooks } from "@/hooks/zodiosHooks";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Props = {
    id: number;
    data: string;
    deleteQuery: "/path-exclusion/:id" | "/license-conclusion/:id";
};

const QueryDeleteButton = ({ id, deleteQuery }: Props) => {
    const { toast } = useToast();
    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const keyPathExclusion = userHooks.getKeyByPath("post", "/path-exclusions");
    const queryClient = useQueryClient();
    const dialogText =
        deleteQuery === "/path-exclusion/:id"
            ? "Path exclusion"
            : "License conclusion";
    const { mutate: deleteItem, isLoading } = userHooks.useDelete(
        deleteQuery,
        {
            withCredentials: true,
            params: {
                id: id,
            },
        },
        {
            onSuccess: () => {
                toast({
                    title: "Delete successful",
                    description: `${dialogText} deleted successfully.`,
                });
                if (deleteQuery === "/path-exclusion/:id") {
                    // When a path exclusion deleted, invalidate the query to refetch the data
                    queryClient.invalidateQueries(keyPathExclusion);
                } else {
                    // When a license conclusion is deleted, invalidate the file and filetree queries to refetch the data
                    queryClient.invalidateQueries(keyFile);
                    queryClient.invalidateQueries(keyFiletree);
                }
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: `${dialogText} deletion failed`,
                    description: "Something went wrong. Please try again.",
                });
            },
        },
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 mr-2 animate-spin" />
            </div>
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" key={id} className="px-2">
                    <Delete></Delete>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to delete this {dialogText}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteItem(undefined)}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default QueryDeleteButton;
