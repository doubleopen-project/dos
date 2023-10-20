// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import Sidebar from "../components/Sidebar";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <TanstackProvider>
                <Sidebar>
                    <Component {...pageProps} />
                </Sidebar>
            </TanstackProvider>
        </ThemeProvider>
    );
}
