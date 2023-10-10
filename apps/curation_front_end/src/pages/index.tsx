// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const user = useUser({});
  return (
    <main className="bg-gray-200 min-h-screen">
      <Header />
      <h1>Welcome to DoubleOpen Front End</h1>
    </main>
  );
}
