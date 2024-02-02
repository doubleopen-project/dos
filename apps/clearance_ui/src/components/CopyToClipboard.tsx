// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    copyText: string;
};

const CopyToClipboard = ({ copyText }: Props) => {
    const [isCopied, setIsCopied] = useState(false);

    async function copyTextToClipboard(text: string) {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            // This is a fallback to browsers (eg. IE), which don't
            // support the clipboard API and can probably be removed
            return document.execCommand("copy", true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(copyText)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleCopyClick}>
                        <div className="fg-slate-300">
                            {isCopied ? (
                                <LuCheck color="gray" />
                            ) : (
                                <LuCopy color="gray" />
                            )}
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isCopied ? "Copied!" : "Copy to clipboard"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default CopyToClipboard;
