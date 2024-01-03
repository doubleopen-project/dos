// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navigation/Navbar";
import TanstackProvider from "@/components/providers/TanstackProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TanstackProvider>
                <Head>
                    <style>
                        @import
                        url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap');
                    </style>
                </Head>
                <div className="flex h-screen flex-col">
                    <Navbar />
                    <main className="h-full w-full overflow-auto">
                        {<Component {...pageProps} />}
                    </main>
                </div>
                <Toaster />
            </TanstackProvider>
        </ThemeProvider>
    );
}
