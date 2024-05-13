// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByAlias } from "@zodios/core";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userAPI } from "validation-helpers";
import { userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/common/delete_item/DeleteDialog";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { DeleteAction } from "@/types";

type ItemType = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusionsByPurl"
>["pathExclusions"][0];

type Props = {
    data: ItemType;
};

const DeletePathExclusion = ({ data }: Props) => {
    const session = useSession();
    const { toast } = useToast();
    const keyPathExclusionsByPurl = userHooks.getKeyByAlias(
        "GetPathExclusionsByPurl",
    );
    const keyPathExclusionCountByPurl = userHooks.getKeyByAlias(
        "GetPathExclusionsCount",
    );
    const keyPathExclusions = userHooks.getKeyByAlias("GetPathExclusions");
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
    const { mutate: deletePathExclusion, isLoading } =
        userHooks.useDeletePathExclusion(
            {
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken}`,
                },
                params: {
                    id: data.id,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Delete successful",
                        description: "Path exclusion deleted successfully.",
                    });

                    // When a path exclusion is deleted, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyPathExclusions);
                    queryClient.invalidateQueries(keyPathExclusionsByPurl);
                    queryClient.invalidateQueries(keyPathExclusionCountByPurl);
                },
                onError: (error) => {
                    const msg = getErrorMessage(error);
                    toast({
                        variant: "destructive",
                        title: "Delete failed",
                        description: msg,
                    });
                },
            },
        );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
        );
    }

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeletePathExclusion;
