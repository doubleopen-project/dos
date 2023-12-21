// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Header from "@/components/Header";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center py-2">
                <h1>Welcome to Double Open Clearance UI</h1>
            </div>
        </main>
    );
}
