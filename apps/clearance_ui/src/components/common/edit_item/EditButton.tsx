// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Pencil } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    name: string;
    className?: string;
    iconSize?: number;
    variant?: ButtonProps["variant"];
    disabled?: boolean;
    disabledTooltipMsg?: string;
    enabledTooltipMsg?: string;
    tooltipAlign?: "start" | "center" | "end";
    tooltipClassName?: string;
};

const EditButton = ({
    onClick,
    name,
    className,
    iconSize,
    variant,
    disabled,
    disabledTooltipMsg,
    enabledTooltipMsg,
    tooltipAlign,
    tooltipClassName,
}: Props) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    {/* This span wrapper ensures tooltip message is shown even when button is disabled */}
                    <span tabIndex={0}>
                        <Button
                            variant={variant || "outline"}
                            className={className}
                            onClick={onClick}
                            name={name}
                            aria-label={name}
                            disabled={disabled}
                        >
                            <Pencil size={iconSize || 16} />
                        </Button>
                    </span>
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
    );
};

export default EditButton;
