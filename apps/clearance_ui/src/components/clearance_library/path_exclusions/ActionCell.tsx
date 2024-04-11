// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import {
    ZodiosBodyByAlias,
    ZodiosError,
    ZodiosResponseByAlias,
} from "@zodios/core";
import { isAxiosError } from "axios";
import { Check, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { userAPI } from "validation-helpers";
import { ZodError } from "zod";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DeletePathExclusion from "@/components/common/delete_item/DeletePathExclusion";
import EditButton from "@/components/common/edit_item/EditButton";

type PathExclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetPathExclusions"
>["pathExclusions"][0];

type PathExclusionUpdateData = ZodiosBodyByAlias<
    typeof userAPI,
    "PutPathExclusion"
>;

const ActionCell = ({ row, table }: CellContext<PathExclusion, unknown>) => {
    // Get user role, to decide what rights the user has for this view
    const user = useUser();
    const session = useSession();
    const peKey = userHooks.getKeyByAlias("GetPathExclusions");
    const queryClient = useQueryClient();
    const meta = table.options.meta;

    const { mutate: UpdatePathExclusion, isLoading } =
        userHooks.usePutPathExclusion(
            {
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken}`,
                },
                params: {
                    id: row.original.id,
                },
            },
            {
                onSuccess: () => {
                    meta?.setSelectedRowsForEditing(() => {
                        const old = meta.selectedRowsForEditing;
                        return {
                            ...old,
                            [parseInt(row.id)]: false,
                        };
                    });
                    meta?.updateOriginalData(row.index);
                    queryClient.invalidateQueries(peKey);
                    toast({
                        title: "Path exclusion updated",
                        description: "Path exclusion updated successfully",
                    });
                },
                onError: (error) => {
                    let msg = "";

                    if (error instanceof ZodiosError) {
                        if (error.cause instanceof ZodError) {
                            for (const err of error.cause.errors) {
                                msg +=
                                    "Error in field '" +
                                    err.path +
                                    "': " +
                                    err.message +
                                    "\n";
                            }
                        } else {
                            msg = error.cause?.message || error.message;
                        }
                    } else if (isAxiosError(error)) {
                        msg = error.response?.data.message;
                    } else {
                        msg = error.message;
                    }

                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: msg,
                    });
                },
            },
        );

    const handleCancel = () => {
        meta?.revertData(row.index);
        meta?.setSelectedRowsForEditing(() => {
            const old = meta.selectedRowsForEditing;
            return {
                ...old,
                [parseInt(row.id)]: false,
            };
        });
    };

    const handleSave = () => {
        const body: PathExclusionUpdateData = {
            pattern: row.getValue("pattern"),
            reason: row.getValue("reason"),
            comment: row.getValue("comment"),
        };
        UpdatePathExclusion(body);
    };

    const handleEdit = () => {
        meta?.setSelectedRowsForEditing(() => {
            const old = meta.selectedRowsForEditing;
            return {
                ...old,
                [parseInt(row.id)]: true,
            };
        });
    };

    return meta?.selectedRowsForEditing[parseInt(row.id)] ? (
        <div className="flex">
            <Button
                onClick={handleSave}
                name="save"
                variant="outline"
                className="mr-1 px-2"
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Check size={16} className="text-green-400" />
                )}
            </Button>
            <Button
                onClick={handleCancel}
                name="cancel"
                variant="outline"
                className="mr-1 px-2"
            >
                <X size={16} className="text-[#ff3366]" />
            </Button>
        </div>
    ) : (
        <>
            {user &&
                (user.role === "ADMIN" ||
                    user.username === row.original.user.username) && (
                    <div className="flex items-center">
                        <EditButton
                            onClick={handleEdit}
                            name="edit"
                            className="mr-1 px-2"
                        />
                        <DeletePathExclusion data={row.original} />
                    </div>
                )}
        </>
    );
};

export default ActionCell;
