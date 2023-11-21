// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import useSettingsStore from "@/store/settings.store";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
    const { setTheme } = useTheme();
    const appTheme = useSettingsStore((state) => state.appTheme);
    const setAppTheme = useSettingsStore((state) => state.setAppTheme);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={appTheme}
                    onValueChange={(value) => setAppTheme(value)}
                >
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
