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
    "get",
    "/packages/:purl/files/:sha256/license-conclusions/"
>["licenseConclusions"][0];

type Props = {
    data: Omit<ItemType, "createdAt">;
};

const DeleteLicenseConclusion = ({ data }: Props) => {
    const { toast } = useToast();
    const keyLCs = userHooks.getKeyByPath(
        "get",
        "/packages/:purl/files/:sha256/license-conclusions/",
    );
    const keyFiletree = userHooks.getKeyByPath(
        "get",
        "/packages/:purl/filetrees",
    );
    const keyLicenseConclusion = userHooks.getKeyByPath(
        "get",
        "/license-conclusions",
    );
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

    // Get possible bulk curation related to this license conclusion
    const { data: bulkCuration } = data.bulkCurationId
        ? userHooks.useGetBulkCurationById({
              withCredentials: true,
              params: {
                  id: data.bulkCurationId,
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
                    Do you want to delete only the license conclusion for this
                    file, or the whole bulk curation?
                </>
            ),
            buttonText: "Delete bulk curation",
            mutation: deleteManyItems,
        });
    }

    function deleteItem() {
        deleteLicenseConclusion(undefined);
    }

    function deleteManyItems() {
        deleteBulkCuration(undefined);
    }

    // Delete a path exclusion or license conclusion
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
                    // When a license conclusion is deleted, invalidate the "/packages/:purl/files/:sha256/license-conclusions", "/filetree" and "/license-conclusions" queries to refetch the data
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyFiletree);
                    queryClient.invalidateQueries(keyLicenseConclusion);
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

    // Delete a bulk curation
    const { mutate: deleteBulkCuration, isLoading: isBulkLoading } =
        userHooks.useDeleteBulkCuration(
            {
                withCredentials: true,
                params: {
                    id: data.bulkCurationId!,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Delete successful",
                        description: `Bulk curation deleted successfully, ${bulkCuration?.filePaths.length} files affected.`,
                    });
                    // When a bulk curation is deleted, invalidate the "/packages/:purl/files/:sha256/license-conclusions", and filetree queries to refetch the data
                    queryClient.invalidateQueries(keyLCs);
                    queryClient.invalidateQueries(keyFiletree);
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
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 mr-2 animate-spin" />
            </div>
        );
    }

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeleteLicenseConclusion;
