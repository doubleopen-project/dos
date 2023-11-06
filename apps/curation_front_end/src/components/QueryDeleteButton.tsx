// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { userHooks } from "@/hooks/zodiosHooks";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Props = {
    id: number;
    data: string;
    deleteQuery: "/path-exclusion/:id" | "/license-conclusion/:id";
};

const QueryDeleteButton = ({ id, deleteQuery }: Props) => {
    const { toast } = useToast();
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
                } else {
                    toast({
                        title: "License conclusion",
                        description: "License conclusion deleted successfully.",
                    });
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
