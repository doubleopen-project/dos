// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

type CopyUserDataProps = {
    copyContent: string;
};

const CopyUserData = ({ copyContent }: CopyUserDataProps) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setCopied(false);
    }, [copyContent]);

    return (
        <div>
            <Separator />
            <p className="py-4 font-semibold ">New user created:</p>
            <div className="flex flex-row">
                <Textarea value={copyContent} rows={5} readOnly />

                <CopyToClipboard text={copyContent}>
                    <Button
                        size="sm"
                        className={cn("ml-2", copied ? "p-3" : "px-3")}
                        onClick={() => setCopied(true)}
                        variant={copied ? "success" : "outline"}
                    >
                        <span className="sr-only">Copy</span>
                        <Copy
                            className={cn(
                                "w-4 h-4",
                                copied ? "hidden" : "visible",
                            )}
                        />
                        <div
                            className={cn(
                                "flex flex-row",
                                copied ? "visible" : "hidden",
                            )}
                        >
                            <span>Copied</span>
                            <Check className="ml-1" />
                        </div>
                    </Button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

export default CopyUserData;
