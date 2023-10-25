// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";

import { Loader2 } from "lucide-react";

import { useUser } from "@/hooks/useUser";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import TokenDialog from "@/components/TokenDialog";
import UserDataForm from "@/components/UserDataForm";
import { Separator } from "@/components/ui/separator";

const settingItems = [
    {
        title: "Profile",
    },
    {
        title: "Tokens",
    },
];

export default function Settings() {
    const user = useUser({ redirectTo: "/login", redirectIfFound: false });

    const [profileVisibility, setProfileVisibility] = useState(true);
    const [tokensVisibility, setTokensVisibility] = useState(false);

    const toggleVisibility = (item: string) => {
        if (item === "profile") {
            setProfileVisibility(true);
            setTokensVisibility(false);
        } else if (item === "tokens") {
            setProfileVisibility(false);
            setTokensVisibility(true);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen p-2">
            <div className="w-full h-full p-20 m-1 border rounded-md shadow-lg">
                <h1 className="pb-2 text-3xl font-semibold leading-none tracking-tight">
                    Settings
                </h1>
                <Separator />
                <div className="flex flex-col pt-4 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            <Button
                                onClick={() => toggleVisibility("profile")}
                                variant={"ghost"}
                                className={profileVisibility ? "bg-accent" : ""}
                            >
                                Profile
                            </Button>
                            <Button
                                onClick={() => toggleVisibility("tokens")}
                                variant={"ghost"}
                                className={tokensVisibility ? "bg-accent" : ""}
                            >
                                Tokens
                            </Button>
                        </nav>
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">
                        <div
                            className={cn(
                                "w-full p-20 border rounded-md shadow-lg",
                                profileVisibility ? "visible" : "hidden",
                            )}
                        >
                            <h2 className="text-2xl font-semibold leading-none tracking-tight">
                                Profile
                            </h2>
                            {user && <UserDataForm user={user} />}
                            {!user && (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                                </div>
                            )}
                        </div>
                        <div
                            className={cn(
                                "w-full p-20 border rounded-md shadow-lg",
                                tokensVisibility ? "visible" : "hidden",
                            )}
                        >
                            <h2 className="pb-5 text-2xl font-semibold leading-none tracking-tights">
                                Tokens
                            </h2>
                            <p className="pt-4">
                                Here you can create a token you will need for
                                running ORT with DOS Scanner, or to use the
                                scanner via the API.
                            </p>
                            <p className="pt-4 pb-8">
                                Please note that your previous token will be
                                invalidated when you create a new one.
                            </p>
                            {user && <TokenDialog />}
                            {!user && (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-16 h-16 mr-2 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
