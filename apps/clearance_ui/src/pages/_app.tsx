// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import TanstackProvider from "@/components/providers/TanstackProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Sidebar from "../components/Sidebar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TanstackProvider>
                <div className="flex">
                    <Sidebar />
                    <main className="w-full overflow-auto">
                        {<Component {...pageProps} />}
                    </main>
                </div>
                <Toaster />
            </TanstackProvider>
        </ThemeProvider>
    );
}
