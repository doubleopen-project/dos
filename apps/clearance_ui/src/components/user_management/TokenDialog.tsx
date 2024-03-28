// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { userHooks } from "@/hooks/zodiosHooks";
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
import { cn } from "@/lib/utils";

const TokenDialog = () => {
    const session = useSession();
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
        headers: {
            Authorization: `Bearer ${session.data?.accessToken}`,
        },
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
                <Button onClick={onGenerateNewToken}>Generate new token</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New token</DialogTitle>
                    <DialogDescription>
                        Please copy and save the generated token.
                    </DialogDescription>
                </DialogHeader>
                {isLoading && (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
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
                                        "h-4 w-4",
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
