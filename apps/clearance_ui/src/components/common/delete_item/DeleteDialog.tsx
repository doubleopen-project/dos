// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
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
import { cn } from "@/lib/utils";
import { DeleteAction } from "@/types";

type Props = {
    deleteActions: DeleteAction[];
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
};

const DeleteDialog = ({
    deleteActions,
    className,
    variant,
    disabled,
}: Props) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    data-testid="delete-clearance-button"
                    variant={variant || "outline"}
                    className={cn(className, "px-2")}
                    disabled={disabled}
                >
                    <Delete></Delete>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteActions?.map(({ dialogMessage, buttonText }) => (
                            <span key={buttonText}>
                                {dialogMessage}
                                <br />
                                <br />
                            </span>
                        ))}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {deleteActions?.map(({ buttonText, mutation }) => (
                        <AlertDialogAction
                            key={buttonText}
                            onClick={() => {
                                mutation();
                            }}
                        >
                            {buttonText}
                        </AlertDialogAction>
                    ))}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;
