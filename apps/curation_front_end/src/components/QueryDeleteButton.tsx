// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { userHooks } from "@/hooks/zodiosHooks";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Props = {
    id: number;
    idBulkCuration?: number | null;
    data: string;
    deleteItemType: "Path exclusion" | "License conclusion";
};

const QueryDeleteButton = ({
    id,
    idBulkCuration,
    data,
    deleteItemType,
}: Props) => {
    const { toast } = useToast();
    const keyFile = userHooks.getKeyByPath("post", "/file");
    const keyFiletree = userHooks.getKeyByPath("post", "/filetree");
    const keyPathExclusion = userHooks.getKeyByPath("post", "/path-exclusions");
    const queryClient = useQueryClient();
    const deleteQuery =
        deleteItemType === "Path exclusion"
            ? "/path-exclusion/:id"
            : "/license-conclusion/:id";

    // Get possible bulk curation related to this license conclusion
    const { data: bulkCuration } = idBulkCuration
        ? userHooks.useGet("/bulk-curation/:id", {
              withCredentials: true,
              params: {
                  id: idBulkCuration,
              },
          })
        : { data: undefined };

    // Delete a path exclusion or license conclusion
    const { mutate: deleteItem, isLoading } = userHooks.useDelete(
        deleteQuery,
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
                    description: `${deleteItemType} deleted successfully.`,
                });
                if (deleteQuery === "/path-exclusion/:id") {
                    // When a path exclusion deleted, invalidate the query to refetch the data
                    queryClient.invalidateQueries(keyPathExclusion);
                } else {
                    // When a license conclusion is deleted, invalidate the file and filetree queries to refetch the data
                    queryClient.invalidateQueries(keyFile);
                    queryClient.invalidateQueries(keyFiletree);
                }
            },
            onError: () => {
                toast({
                    variant: "destructive",
                    title: `${deleteItemType} deletion failed`,
                    description: "Something went wrong. Please try again.",
                });
            },
        },
    );

    // Delete a bulk curation
    const { mutate: deleteBulk, isLoading: isBulkLoading } =
        userHooks.useDelete(
            "/bulk-curation/:id",
            {
                withCredentials: true,
                params: {
                    id: idBulkCuration!,
                },
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Delete successful",
                        description: `Bulk curation deleted successfully, ${bulkCuration?.filePaths.length} files affected.`,
                    });
                    // When a bulk curation is deleted, invalidate the file and filetree queries to refetch the data
                    queryClient.invalidateQueries(keyFile);
                    queryClient.invalidateQueries(keyFiletree);
                },
                onError: () => {
                    toast({
                        variant: "destructive",
                        title: "Bulk curation deletion failed",
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

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" key={id} className="px-2">
                    <Delete></Delete>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteItemType === "Path exclusion" && (
                            <>
                                Are you sure you want to delete this path
                                exclusion: <strong>{data}</strong>?
                            </>
                        )}
                        {deleteItemType === "License conclusion" && (
                            <>
                                {bulkCuration ? (
                                    <>
                                        This is a bulk curation, curating{" "}
                                        <strong>
                                            {bulkCuration.filePaths.length}
                                        </strong>{" "}
                                        files as{" "}
                                        <strong>
                                            {
                                                bulkCuration.concludedLicenseExpressionSPDX
                                            }
                                        </strong>{" "}
                                        with the pattern{" "}
                                        <strong>{bulkCuration.pattern}</strong>.
                                        <br />
                                        <br />
                                        Do you want to delete only the license
                                        conclusion for this file, or the whole
                                        bulk curation?
                                    </>
                                ) : (
                                    <>
                                        Are you sure you want to delete this
                                        license conclusion:{" "}
                                        <strong>{data}</strong>?
                                    </>
                                )}
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteItem(undefined)}>
                        Delete this
                    </AlertDialogAction>
                    {bulkCuration && (
                        <AlertDialogAction
                            onClick={() => {
                                deleteBulk(undefined);
                            }}
                        >
                            Delete bulk curation
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default QueryDeleteButton;
