// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// This is an example of a store that uses zustand, storing the theme of the app.
// (The theme is persisted by next-themes anyway, so this is only here for a future use.)

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    appTheme: string;
};

type Actions = {
    setAppTheme: (appTheme: string) => void;
};

const useThemeStore = create<State & Actions>()(
    persist(
        (set) => ({
            appTheme: "light",
            setAppTheme: (appTheme: string) => set({ appTheme }),
        }),
        {
            name: "theme-storage",
        },
    ),
);

export default useThemeStore;
