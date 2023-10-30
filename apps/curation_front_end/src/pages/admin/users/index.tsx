// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";

import { Loader2 } from "lucide-react";

import { useUser } from "@/hooks/useUser";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import AddUserForm from "@/components/AddUserForm";
import { Separator } from "@/components/ui/separator";

export default function UserManagement() {
    const user = useUser({ redirectTo: "/login", admin: true });

    const [visibleElement, setVisibleElement] = useState("addUser");

    const toggleVisibility = (item: string) => {
        setVisibleElement(item);
    };

    return (
        <div className="flex items-center justify-center h-screen p-2">
            {!user && <Loader2 className="w-16 h-16 mr-2 animate-spin" />}
            {user && user.role === "ADMIN" && (
                <div className="w-full h-full p-20 m-1 border rounded-md shadow-lg">
                    <h1 className="pb-2">Manage users</h1>
                    <Separator />
                    <div className="flex flex-col pt-4 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="-mx-4 lg:w-1/5">
                            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                                <Button
                                    onClick={() => toggleVisibility("addUser")}
                                    variant={"ghost"}
                                    className={
                                        visibleElement === "addUser"
                                            ? "bg-accent"
                                            : ""
                                    }
                                >
                                    Register new user
                                </Button>
                            </nav>
                        </aside>
                        <div className="flex-1 lg:max-w-2xl">
                            <div
                                className={cn(
                                    visibleElement === "addUser"
                                        ? ""
                                        : "hidden",
                                )}
                            >
                                <h2 className="text-xl">Register new user</h2>
                                <AddUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
