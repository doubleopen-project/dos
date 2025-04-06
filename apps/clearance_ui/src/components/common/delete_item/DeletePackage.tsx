// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByPath } from "@zodios/core";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userAPI } from "validation-helpers";
import { adminHooks, userHooks } from "@/hooks/zodiosHooks";
import { useToast } from "@/components/ui/use-toast";
import DeleteDialog from "@/components/common/delete_item/DeleteDialog";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { DeleteAction } from "@/types";

type ItemType = ZodiosResponseByPath<
    typeof userAPI,
    "get",
    "/packages"
>["packages"][0];

type Props = {
    data: ItemType;
};

const DeletePackage = ({ data }: Props) => {
    const session = useSession();
    const { toast } = useToast();
    const keyPackages = userHooks.getKeyByPath("get", "/packages");
    const queryClient = useQueryClient();
    const deleteActions: DeleteAction[] = [];

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
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken}`,
                },
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

    if (isPackageLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
        );
    }

    return <DeleteDialog deleteActions={deleteActions} />;
};

export default DeletePackage;
