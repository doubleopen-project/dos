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
    const keyFiletree = userHooks.getKeyByPath(
        "get",
        "/packages/:purl/filetrees",
    );
    const keyLicenseConclusion = userHooks.getKeyByPath(
        "get",
        "/license-conclusions",
    );
    const keyLCs = userHooks.getKeyByPath(
        "get",
        "/packages/:purl/files/:sha256/license-conclusions/",
    );
    const keyBulkCuration = userHooks.getKeyByPath("get", "/bulk-curations");
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    const { data: bulkCuration } = userHooks.useGet("/bulk-curations/:id", {
        withCredentials: true,
        params: {
            id: id,
        },
    });

    if (bulkCuration) {
        deleteActions.push({
            dialogMessage: (
                <>
                    This is a bulk license conclusion, concluding{" "}
                    <strong>{bulkCuration.filePaths.length}</strong> files as{" "}
                    <strong>
                        {bulkCuration.concludedLicenseExpressionSPDX}
                    </strong>{" "}
                    with the pattern <strong>{bulkCuration.pattern}</strong>.
                    <br />
                    <br />
                    Do you want to delete this bulk conclusion?
                </>
            ),
            buttonText: "Delete bulk conclusion",
            mutation: deleteManyItems,
        });
    }

    function deleteManyItems() {
        deleteBulkCuration(undefined);
    }

    // Delete a bulk curation
    const { mutate: deleteBulkCuration, isLoading: isBulkLoading } =
        userHooks.useDelete(
            "/bulk-curations/:id",
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
                        description: `Bulk license conclusion deleted successfully, ${bulkCuration?.filePaths.length} files affected.`,
                    });
                    // When a bulk curation is deleted, invalidate queries to refetch the data
                    queryClient.invalidateQueries(keyFile);
                    queryClient.invalidateQueries(keyFiletree);
                    queryClient.invalidateQueries(keyLicenseConclusion);
                    queryClient.invalidateQueries(keyBulkCuration);
                    queryClient.invalidateQueries(keyLCs);
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Delete failed",
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
