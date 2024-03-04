// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { KeyRound, LogOut, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import { GrLogin } from "react-icons/gr";
import { LiaUser } from "react-icons/lia";
import { useUser } from "@/hooks/useUser";
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
import { cn } from "@/lib/utils";

type UserMenuItemProps = {
    className?: string;
};
const UserMenuItem = ({ className }: UserMenuItemProps) => {
    const user = useUser();
    if (!user) {
        return (
            <Link href="/login" className={cn(className)}>
                <Button variant="outline" size="sm">
                    <GrLogin size={20} className="mr-2" />
                    <span>Log in</span>
                </Button>
            </Link>
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
                        <DropdownMenuItem>
                            <Link
                                href="/settings?section=tokens"
                                className="w-full"
                            >
                                <KeyRound className="mr-2 inline-block h-4 w-4" />
                                <span>Tokens</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {user.role === "ADMIN" && (
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
                        <Link href="/logout" className="w-full">
                            <LogOut className="mr-2 inline-block h-4 w-4" />
                            <span>Log out</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
};

export default UserMenuItem;
