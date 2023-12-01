// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByPath } from "@zodios/core";
import { Loader2 } from "lucide-react";
import { userAPI } from "validation-helpers";
import { adminHooks, userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/delete_item/DeleteDialog";
import { DeleteAction } from "@/types";

type ItemType = ZodiosResponseByPath<typeof userAPI, "get", "/packages">;

type Props = {
    data: ItemType["packages"][0];
};

const DeletePackage = ({ data }: Props) => {
    const { toast } = useToast();
    const keyPackages = userHooks.getKeyByPath("get", "/packages");
    const queryClient = useQueryClient();
    let deleteActions: DeleteAction[] = [];

    deleteActions.push({
        dialogMessage: (
            <>
                Are you sure you want to delete this package:
                <br />
                <br />
                <strong>
                    {data.name}:{data.version}
                </strong>
            </>
        ),
        buttonText: "Delete",
        mutation: deleteItem,
    });

    function deleteItem() {
        deletePackage({ purl: data.purl });
    }

    // Delete a package
    const { mutate: deletePackage, isLoading: isPackageLoading } =
        adminHooks.useDelete(
            "/scan-results",
            {
                withCredentials: true,
                purl: data.purl,
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Delete successful",
                        description: `Package deleted successfully.`,
                    });
                    // When a package deleted, invalidate the package query to refetch the data
                    queryClient.invalidateQueries(keyPackages);
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Package deletion failed",
                        description: "Something went wrong. Please try again.",
                    });
                },
            },
        );

    if (isPackageLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 mr-2 animate-spin" />
            </div>
        );
    }

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeletePackage;
