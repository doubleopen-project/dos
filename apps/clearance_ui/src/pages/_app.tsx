// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navigation/Navbar";
import TanstackProvider from "@/components/providers/TanstackProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider
                session={session}
                refetchInterval={
                    parseInt(process.env.REFETCH_INTERVAL as string) || 60
                }
                refetchOnWindowFocus={true}
            >
                <TanstackProvider>
                    <div className="flex h-screen flex-col">
                        <Navbar />
                        <main className="h-full w-full overflow-auto">
                            <NuqsAdapter>
                                {<Component {...pageProps} />}
                            </NuqsAdapter>
                        </main>
                    </div>
                    <Toaster />
                </TanstackProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
