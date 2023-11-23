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
    idBulkCuration?: number | null;
    data: string;
    deleteItemType: "Path exclusion" | "License conclusion";
};

const QueryDeleteButton = ({
    id,
    idBulkCuration,
    data,
    deleteItemType,
}: Props) => {
    const { toast } = useToast();
    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const keyPathExclusion = userHooks.getKeyByPath("post", "/path-exclusions");
    const queryClient = useQueryClient();
    const deleteQuery =
        deleteItemType === "Path exclusion"
            ? "/path-exclusion/:id"
            : "License conclusion"
              ? "/license-conclusion/:id"
              : "/bulk-curation/:id";

    // Get possible bulk curation related to this license conclusion
    const { data: bulkCuration } = idBulkCuration
        ? userHooks.useGet("/bulk-curation/:id", {
              withCredentials: true,
              params: {
                  id: idBulkCuration,
              },
          })
        : { data: undefined };

    // Delete the path exclusion or license conclusion
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
                    description: `${deleteItemType} deleted successfully.`,
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
                    title: `${deleteItemType} deletion failed`,
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
                        {deleteItemType === "Path exclusion" &&
                            `Are you sure you want to delete this path exclusion: ${data}?`}
                        {deleteItemType === "License conclusion" &&
                            (bulkCuration
                                ? "This is a bulk curation with pattern " +
                                  bulkCuration.pattern +
                                  ", curating " +
                                  bulkCuration.filePaths.length +
                                  " files. Do you want to delete only this license conclusion or the whole bulk curation?"
                                : "Are you sure you want to delete this license conclusion: " +
                                  data +
                                  "?")}
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
