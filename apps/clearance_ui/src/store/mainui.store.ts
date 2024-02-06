// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    purl: string;
    path: string;
    licenseFilter: string;
    filtering: boolean;
};

type Actions = {
    setPurl: (p: string) => void;
    setPath: (p: string) => void;
    setLicenseFilter: (l: string) => void;
    setFiltering: (f: boolean) => void;
};

const useMainUiStore = create<State & Actions>()(
    persist(
        (set) => ({
            purl: "",
            setPurl: (p) => set({ purl: p }),
            path: "",
            setPath: (p) => set({ path: p }),
            licenseFilter: "",
            setLicenseFilter: (l) => set({ licenseFilter: l }),
            filtering: false,
            setFiltering: (f) => set({ filtering: f }),
        }),
        {
            name: "mainui-storage",
        },
    ),
);

export default useMainUiStore;
