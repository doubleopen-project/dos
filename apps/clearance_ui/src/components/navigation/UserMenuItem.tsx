// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useQueryClient } from "@tanstack/react-query";
import { LogOut, UserRound, UsersRound } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { GrLogin } from "react-icons/gr";
import { LiaUser } from "react-icons/lia";
import { useUser } from "@/hooks/useUser";
import { authHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type UserMenuItemProps = {
    className?: string;
};
const UserMenuItem = ({ className }: UserMenuItemProps) => {
    const user = useUser();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { mutate: logoutUser } = authHooks.usePostLogout(undefined, {
        onSuccess: () => {
            queryClient.removeQueries();
            signOut({ callbackUrl: "/", redirect: true });
        },
        onError: (error) => {
            console.error("Failed to log out", error);
            toast({
                variant: "destructive",
                title: "Failed to log out",
                description: "Please try again",
            });
        },
    });

    if (!user) {
        return (
            <Button
                onClick={() => signIn("keycloak")}
                variant="outline"
                size="sm"
                className={cn(className)}
            >
                <GrLogin size={20} className="mr-2" />
                <span>Log in</span>
            </Button>
        );
    } else {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(className)}
                    >
                        <LiaUser size={20} className="mr-1" />
                        <span>{user.username}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link
                                href="/settings?section=profile"
                                className="w-full"
                            >
                                <UserRound className="mr-2 inline-block h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {user.role === "app-admin" && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link
                                        href="/admin/users"
                                        className="w-full"
                                    >
                                        <UsersRound className="mr-2 inline-block h-4 w-4" />
                                        <span>Manage Users</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button
                            onClick={() => {
                                logoutUser(undefined);
                            }}
                            variant="outline"
                        >
                            {/*<Link href="/logout" className="w-full">*/}
                            <LogOut className="mr-2 inline-block h-4 w-4" />
                            <span>Log out</span>

                            {/*</Link>*/}
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
};

export default UserMenuItem;
