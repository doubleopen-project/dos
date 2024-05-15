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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
    disabledTooltipMsg?: string;
    enabledTooltipMsg?: string;
    tooltipAlign?: "start" | "center" | "end";
    tooltipClassName?: string;
};

const DeleteDialog = ({
    deleteActions,
    className,
    variant,
    disabled,
    disabledTooltipMsg,
    enabledTooltipMsg,
    tooltipAlign,
    tooltipClassName,
}: Props) => {
    return (
        <AlertDialog>
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            {/* This span wrapper ensures tooltip message is shown even when button is disabled */}
                            <span tabIndex={0}>
                                <Button
                                    data-testid="delete-clearance-button"
                                    variant={variant || "outline"}
                                    className={cn(className, "px-2")}
                                    disabled={disabled}
                                >
                                    <Delete></Delete>
                                </Button>
                            </span>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                        className={cn(
                            tooltipClassName,
                            (disabled && !disabledTooltipMsg) ||
                                (!disabled && !enabledTooltipMsg)
                                ? "hidden"
                                : undefined,
                        )}
                        align={tooltipAlign || "center"}
                    >
                        <div className="text-sm">
                            {disabled ? disabledTooltipMsg : enabledTooltipMsg}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* Adding the preventDefault will prevent focusing on the trigger after closing the modal (which would cause the tooltip to show) */}
            <AlertDialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
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
