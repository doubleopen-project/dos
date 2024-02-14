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

const DeleteBulkConclusion = ({ id }: Props) => {
    const { toast } = useToast();
    const keyLCs = userHooks.getKeyByAlias(
        "GetLicenseConclusionsForFileInPackage",
    );
    const keyFiletree = userHooks.getKeyByAlias("GetFileTree");
    const keyLicenseConclusion = userHooks.getKeyByAlias(
        "GetLicenseConclusions",
    );
    const keyLicenseConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetLicenseConclusionsCount",
    );
    const keyBulkConclusion = userHooks.getKeyByAlias("GetBulkConclusions");
    const keyBulkConclusionsByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsByPurl",
    );

    const keyBulkConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsCount",
    );

    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    const { data: bulkConclusion } = userHooks.useGetBulkConclusionById({
        withCredentials: true,
        params: {
            id: id,
        },
    });

    if (bulkConclusion) {
        deleteActions.push({
            dialogMessage: (
                <>
                    This is a bulk license conclusion, concluding{" "}
                    <strong>{bulkConclusion.filePaths.length}</strong> files as{" "}
                    <strong>
                        {bulkConclusion.concludedLicenseExpressionSPDX}
                    </strong>{" "}
                    with the pattern <strong>{bulkConclusion.pattern}</strong>.
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
        deleteBulkConclusion(undefined);
    }

    // Delete a bulk curation
    const { mutate: deleteBulkConclusion, isLoading: isBulkLoading } =
        userHooks.useDeleteBulkConclusion(
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
                        description: `Bulk license conclusion deleted successfully, ${bulkConclusion?.filePaths.length} files affected.`,
                    });
                    // When a bulk conclusion is deleted, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyFiletree);
                    queryClient.invalidateQueries(keyLicenseConclusion);
                    queryClient.invalidateQueries(keyBulkConclusion);
                    queryClient.invalidateQueries(keyBulkConclusionsByPurl);
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyBulkConclusionCountByPurl);
                    queryClient.invalidateQueries(
                        keyLicenseConclusionCountByPurl,
                    );
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
            <div className="flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
        );
    }

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeleteBulkConclusion;
