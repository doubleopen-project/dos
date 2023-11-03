// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useUser } from "@/hooks/useUser";

import { cn } from "@/lib/utils";

import TokenDialog from "@/components/TokenDialog";
import UserDataForm from "@/components/UserDataForm";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
    const user = useUser({ redirectTo: "/login", redirectIfFound: false });

    const searchParams = useSearchParams();
    const section = searchParams.get("section") || "profile";

    return (
        <div className="flex items-center justify-center h-screen p-2">
            <div className="w-full h-full p-20 m-1 border rounded-md shadow-lg">
                <h1 className="pb-2">Settings</h1>
                <Separator />
                <div className="flex flex-col pt-4 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            <Link
                                href="/settings?section=profile"
                                className={cn(
                                    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
                                    section === "profile" ? "bg-accent" : "",
                                )}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/settings?section=tokens"
                                className={cn(
                                    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
                                    section === "tokens" ? "bg-accent" : "",
                                )}
                            >
                                Tokens
                            </Link>
                        </nav>
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">
                        <div
                            className={cn(
                                "w-full p-20 border rounded-md shadow-lg",
                                section === "profile" ? "visible" : "hidden",
                            )}
                        >
                            <h2>Profile</h2>
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
                                section === "tokens" ? "visible" : "hidden",
                            )}
                        >
                            <h2 className="pb-5">Tokens</h2>
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
