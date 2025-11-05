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
import DeleteDialog from "@/components/common/delete_item/DeleteDialog";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { DeleteAction } from "@/types";

type ItemType = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages/:purl/files/:sha256/license-conclusions/"
>["licenseConclusions"][0];

type Props = {
    data: Omit<ItemType, "createdAt">;
    className?: string;
    variant?:
        | "outline"
        | "default"
        | "link"
        | "destructive"
        | "secondary"
        | "ghost"
        | "success";
    disabled?: boolean;
    disabledTooltipMsg?: string;
    enabledTooltipMsg?: string;
    tooltipAlign?: "start" | "center" | "end";
    tooltipClassName?: string;
};

const DeleteLicenseConclusion = ({
    data,
    className,
    variant,
    disabled,
    disabledTooltipMsg,
    enabledTooltipMsg,
    tooltipAlign,
    tooltipClassName,
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
    const keyBulkConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsCountByPurl",
    );
    const keyBulkConclusionCount = userHooks.getKeyByAlias(
        "GetBulkConclusionsCount",
    );
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    // Get possible bulk curation related to this license conclusion
    const { data: bulkConclusion } = data.bulkConclusionId
        ? userHooks.useGetBulkConclusionById({
              params: {
                  id: data.bulkConclusionId,
              },
          })
        : { data: undefined };

    deleteActions.push({
        dialogMessage: (
            <>
                Are you sure you want to delete this license conclusion:
                <br />
                <br />
                SPDX: <strong>{data.concludedLicenseExpressionSPDX}</strong>
                <br />
                Comment: {data.comment}
                <br />
                Created by: <strong>{data.curator.username}</strong>
            </>
        ),
        buttonText: "Delete",
        mutation: deleteItem,
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
                    Do you want to delete only the license conclusion for this
                    file, or the whole bulk conclusion?
                </>
            ),
            buttonText: "Delete bulk conclusion",
            mutation: deleteManyItems,
        });
    }

    function deleteItem() {
        deleteLicenseConclusion(undefined);
    }

    function deleteManyItems() {
        deleteBulkConclusion(undefined);
    }

    const { mutate: deleteLicenseConclusion, isLoading } =
        userHooks.useDeleteLicenseConclusion(
            {
                params: {
                    id: data.id,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Delete successful",
                        description: "License conclusion deleted successfully.",
                    });
                    // When a license conclusion is deleted, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyLicenseConclusion);
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

    // Delete a bulk conclusion
    const { mutate: deleteBulkConclusion, isLoading: isBulkLoading } =
        userHooks.useDeleteBulkConclusion(
            {
                params: {
                    id: data.bulkConclusionId!,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Delete successful",
                        description: `Bulk license conclusion deleted successfully, ${bulkConclusion?.filePaths.length} files affected.`,
                    });
                    // When a bulk conclusion is deleted, invalidate the corresponding queries to refetch the data
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyBulkConclusionCountByPurl);
                    queryClient.invalidateQueries(keyLicenseConclusion);
                    queryClient.invalidateQueries(keyBulkConclusionCount);
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

    if (isLoading || isBulkLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
        );
    }

    return (
        <DeleteDialog
            deleteActions={deleteActions}
            className={className}
            variant={variant}
            disabled={disabled}
            disabledTooltipMsg={disabledTooltipMsg}
            enabledTooltipMsg={enabledTooltipMsg}
            tooltipAlign={tooltipAlign}
            tooltipClassName={tooltipClassName}
        />
    );
};

export default DeleteLicenseConclusion;
