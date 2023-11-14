// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userHooks } from "@/hooks/zodiosHooks";
import { cn } from "@/lib/utils";
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const TokenDialog = () => {
    const [token, setToken] = useState("");
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false);

    const {
        isLoading,
        isSuccess,
        reset,
        mutate: generateToken,
    } = userHooks.usePut("/token", {
        params: { id: true },
        withCredentials: true,
    });

    const onGenerateNewToken = () => {
        generateToken(undefined, {
            onSuccess: (data) => {
                setToken(data.token);
            },
        });
    };

    const toggleOpen = () => {
        setOpen(!open);
        if (open) reset();
    };

    return (
        <Dialog onOpenChange={toggleOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={onGenerateNewToken}>
                    Generate new token
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New token</DialogTitle>
                    <DialogDescription>
                        Please copy and save the generated token.
                    </DialogDescription>
                </DialogHeader>
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                    </div>
                )}
                {isSuccess && (
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">
                                Token
                            </Label>
                            <Input
                                id="link"
                                value={token}
                                readOnly
                                onChange={({ target: { value } }) =>
                                    setToken(value)
                                }
                            />
                        </div>

                        <CopyToClipboard text={token}>
                            <Button
                                size="sm"
                                className="px-3"
                                onClick={() => setCopied(true)}
                                onMouseLeave={() => setCopied(false)}
                            >
                                <span className="sr-only">Copy</span>
                                <Copy
                                    className={cn(
                                        "w-4 h-4",
                                        copied ? "hidden" : "visible",
                                    )}
                                />
                                <span className={copied ? "visible" : "hidden"}>
                                    Copied <Check className="inline" />
                                </span>
                            </Button>
                        </CopyToClipboard>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TokenDialog;
