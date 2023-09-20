// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Sidebar from "../components/Sidebar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Sidebar>
            <Component {...pageProps} />
        </Sidebar>
    )
}
