// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ModeToggleProps = {
    className?: string;
};

export function ModeToggle({ className }: ModeToggleProps) {
    const { setTheme } = useTheme();
    //const appTheme = useSettingsStore((state) => state.appTheme);
    //const setAppTheme = useSettingsStore((state) => state.setAppTheme);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn(className)}>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup>
                    <DropdownMenuRadioItem
                        value="light"
                        onClick={() => setTheme("light")}
                    >
                        Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value="dark"
                        onClick={() => setTheme("dark")}
                    >
                        Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value="system"
                        onClick={() => setTheme("system")}
                    >
                        System
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
