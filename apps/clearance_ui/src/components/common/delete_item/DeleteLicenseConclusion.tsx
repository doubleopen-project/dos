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
};

const DeleteLicenseConclusion = ({ data, className, variant }: Props) => {
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
    const keyBulkConclusionCountByPurl = userHooks.getKeyByAlias(
        "GetBulkConclusionsCount",
    );
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    // Get possible bulk curation related to this license conclusion
    const { data: bulkConclusion } = data.bulkConclusionId
        ? userHooks.useGetBulkConclusionById({
              withCredentials: true,
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
                Created by: <strong>{data.user.username}</strong>
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
                withCredentials: true,
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
                    queryClient.invalidateQueries(keyFiletree);
                    queryClient.invalidateQueries(keyLicenseConclusion);
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

    // Delete a bulk conclusion
    const { mutate: deleteBulkConclusion, isLoading: isBulkLoading } =
        userHooks.useDeleteBulkConclusion(
            {
                withCredentials: true,
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
                    queryClient.invalidateQueries(keyFiletree);
                    queryClient.invalidateQueries(keyBulkConclusionCountByPurl);
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
        />
    );
};

export default DeleteLicenseConclusion;
