// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { adminHooks, userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/delete_item/DeleteDialog";
import { DeleteAction } from "@/types";

type Props = {
    purl: string;
};

const DeletePackage = ({ purl }: Props) => {
    const { toast } = useToast();
    const keyPackages = userHooks.getKeyByPath("get", "/packages");
    const queryClient = useQueryClient();
    let deleteActions: DeleteAction[] = [];

    deleteActions.push({
        message: `Do you want to delete the package ${purl}?`,
        actionTxt: "Delete",
        onActionClick: (actionTxt) => {
            console.log(actionTxt);
            // Handle the action...
        },
    });

    // Delete a package
    const { mutate: deletePackage, isLoading: isPackageLoading } =
        adminHooks.useDelete(
            "/scan-results",
            {
                withCredentials: true,
                purl: purl,
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
