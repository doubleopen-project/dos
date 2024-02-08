// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { IoMenuSharp } from "react-icons/io5";
import { LuFileStack } from "react-icons/lu";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import UserMenuItem from "./UserMenuItem";

const Navbar = () => {
    const user = useUser();
    return (
        <div className="overflow-none flex flex-row items-center justify-between border-b-[1px] py-2">
            <div className="flex items-center justify-start">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-2">
                            <IoMenuSharp size="20px" color="gray" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Pages</SheetTitle>
                            <SheetDescription>
                                Additional pages that help in the clearance
                                work. This includes libraries, which list all
                                the packages and clearances available in the
                                database.
                            </SheetDescription>
                        </SheetHeader>
                        {user && (
                            <div className="grid gap-4 py-4">
                                <SheetClose asChild>
                                    <Link
                                        href="/packages"
                                        className="inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <div className="flex items-center">
                                            <LuFileStack
                                                size="20px"
                                                className="mr-2"
                                            />
                                            Package Library
                                        </div>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/clearances"
                                        className="inline-block rounded-lg px-2 py-1 text-sm hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        <div className="flex items-center">
                                            <AiOutlineEye
                                                size="20px"
                                                className="mr-2"
                                            />
                                            Clearance Library
                                        </div>
                                    </Link>
                                </SheetClose>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
                <Link href="/" className="pl-2 pr-4">
                    <span className="logo">doubleOpen</span>
                    <span className="logo logo-brackets">()</span>
                </Link>
            </div>
            {/* Insert package and file path here */}
            <div>
                <UserMenuItem user={user} className="mr-1" />
                <ModeToggle className="mr-1" />
            </div>
        </div>
    );
};

export default Navbar;
