// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { userHooks } from "@/hooks/zodiosHooks";

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
                if (deleteQuery === "/path-exclusion/:id") {
                    toast({
                        title: "Path exclusion",
                        description: "Path exclusion deleted successfully.",
                    });
                    // When a path exclusion deleted, invalidate the query to refetch the data
                    queryClient.invalidateQueries(keyPathExclusion);
                } else {
                    toast({
                        title: "License conclusion",
                        description: "License conclusion deleted successfully.",
                    });
                    // When a license conclusion is deleted, invalidate the file and filetree queries to refetch the data
                    queryClient.invalidateQueries(keyFile);
                    queryClient.invalidateQueries(keyFiletree);
                }
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Path exclusion",
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

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete this?`)) {
            deleteItem(undefined);
        }
    };

    return (
        <Button
            variant="outline"
            key={id}
            className="px-2"
            onClick={() => handleDelete()}
        >
            <Delete></Delete>
        </Button>
    );
};

export default QueryDeleteButton;
