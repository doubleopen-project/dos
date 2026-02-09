// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/common/delete_item/DeleteDialog";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { DeleteAction } from "@/types";

type Props = {
    id: number;
    disabled?: boolean;
    disabledTooltipMsg?: string;
    enabledTooltipMsg?: string;
};

const DeleteBulkConclusion = ({
    id,
    disabled,
    disabledTooltipMsg,
    enabledTooltipMsg,
}: Props) => {
    const { toast } = useToast();
    const keyLCs = userHooks.getKeyByAlias(
        "GetLicenseConclusionsForFileInPackage",
    );
    const keyLicenseConclusion = userHooks.getKeyByAlias(
        "GetLicenseConclusions",
    );
    const keyLicenseConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetLicenseConclusionsCount",
    );
    const keyBulkConclusions = userHooks.getKeyByAlias("GetBulkConclusions");
    const keyBulkConclusionsCount = userHooks.getKeyByAlias(
        "GetBulkConclusionsCount",
    );
    const keyBulkConclusionsByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsByPurl",
    );
    const keyBulkConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsCountByPurl",
    );

    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    const { data: bulkConclusion } = userHooks.useGetBulkConclusionById({
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
                    with the pattern{" "}
                    <strong className="break-all">
                        {bulkConclusion.pattern}
                    </strong>
                    .
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
                    queryClient.invalidateQueries(keyLicenseConclusion);
                    queryClient.invalidateQueries(keyBulkConclusions);
                    queryClient.invalidateQueries(keyBulkConclusionsCount);
                    queryClient.invalidateQueries(keyBulkConclusionsByPurl);
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyBulkConclusionCountByPurl);
                    queryClient.invalidateQueries(
                        keyLicenseConclusionCountByPurl,
                    );
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

    if (isBulkLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
        );
    }

    return (
        <DeleteDialog
            deleteActions={deleteActions}
            disabled={disabled}
            disabledTooltipMsg={disabledTooltipMsg}
            enabledTooltipMsg={enabledTooltipMsg}
        />
    );
};

export default DeleteBulkConclusion;
