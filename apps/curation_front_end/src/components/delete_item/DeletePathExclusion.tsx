// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByPath } from "@zodios/core";
import { Loader2 } from "lucide-react";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/delete_item/DeleteDialog";
import { DeleteAction } from "@/types";

type ItemType = ZodiosResponseByPath<
    typeof userAPI,
    "post",
    "/path-exclusions"
>["pathExclusions"][0];

type Props = {
    data: ItemType;
};

const DeletePathExclusion = ({ data }: Props) => {
    const { toast } = useToast();
    const keyPathExclusion = userHooks.getKeyByPath("post", "/path-exclusions");
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    deleteActions.push({
        dialogMessage: (
            <>
                Are you sure you want to delete this path exclusion:
                <br />
                <br />
                Pattern: <strong>{data.pattern}</strong>
                <br />
                Reason: <strong>{data.reason}</strong>
                <br />
                Comment: {data.comment}
                <br />
                Created by: <strong>{data.user.username}</strong>
            </>
        ),
        buttonText: "Delete",
        mutation: deleteItem,
    });

    function deleteItem() {
        deletePathExclusion(undefined);
    }

    // Delete a path exclusion or license conclusion
    const { mutate: deletePathExclusion, isLoading } = userHooks.useDelete(
        "/path-exclusion/:id",
        {
            withCredentials: true,
            params: {
                id: data.id,
            },
        },
        {
            onSuccess: () => {
                toast({
                    title: "Delete successful",
                    description: "Path exclusion deleted succesfully",
                });

                // When a path exclusion deleted, invalidate the query to refetch the data
                queryClient.invalidateQueries(keyPathExclusion);
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Path exclusion deletion failed",
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

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeletePathExclusion;
