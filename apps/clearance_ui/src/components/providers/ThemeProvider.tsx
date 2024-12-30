// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import {
    ThemeProvider as NextThemesProvider,
    type ThemeProviderProps,
} from "next-themes";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
