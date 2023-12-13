// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/delete_item/DeleteDialog";
import { DeleteAction } from "@/types";

type Props = {
    id: number;
};

const DeleteBulkCuration = ({ id }: Props) => {
    const { toast } = useToast();
    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const keyLicenseConclusion = userHooks.getKeyByPath(
        "post",
        "/license-conclusion",
    );
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    const { data: bulkCuration } = userHooks.useGet("/bulk-curation/:id", {
        withCredentials: true,
        params: {
            id: id,
        },
    });

    if (bulkCuration) {
        deleteActions.push({
            dialogMessage: (
                <>
                    This is a bulk curation, curating{" "}
                    <strong>{bulkCuration.filePaths.length}</strong> files as{" "}
                    <strong>
                        {bulkCuration.concludedLicenseExpressionSPDX}
                    </strong>{" "}
                    with the pattern <strong>{bulkCuration.pattern}</strong>.
                    <br />
                    <br />
                    Do you want to delete this bulk curation?
                </>
            ),
            buttonText: "Delete bulk curation",
            mutation: deleteManyItems,
        });
    }

    function deleteManyItems() {
        deleteBulkCuration(undefined);
    }

    // Delete a bulk curation
    const { mutate: deleteBulkCuration, isLoading: isBulkLoading } =
        userHooks.useDelete(
            "/bulk-curation/:id",
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
                        description: `Bulk curation deleted successfully, ${bulkCuration?.filePaths.length} files affected.`,
                    });
                    // When a bulk curation is deleted, invalidate the file and filetree queries to refetch the data
                    queryClient.invalidateQueries(keyFile);
                    queryClient.invalidateQueries(keyFiletree);
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Bulk curation deletion failed",
                        description: "Something went wrong. Please try again.",
                    });
                },
            },
        );

    if (isBulkLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 mr-2 animate-spin" />
            </div>
        );
    }

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeleteBulkCuration;
