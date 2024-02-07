// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    purl: string;
    path: string;
};

type Actions = {
    setPurl: (p: string) => void;
    setPath: (p: string) => void;
};

const useMainUiStore = create<State & Actions>()(
    persist(
        (set) => ({
            purl: "",
            setPurl: (p) => set({ purl: p }),
            path: "",
            setPath: (p) => set({ path: p }),
        }),
        {
            name: "mainui-storage",
        },
    ),
);

export default useMainUiStore;
