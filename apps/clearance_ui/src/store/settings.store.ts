// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

// This is an example of a store that uses zustand, storing the theme of the app.
// (The theme is persisted by next-themes anyway, so this is only here for a future use.)

import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    mainWidths: number[];
    clearanceHeights: number[];
};

type Actions = {
    setMainWidths: (w: number[]) => void;
    setClearanceHeights: (h: number[]) => void;
};

const useSettingsStore = create<State & Actions>()(
    persist(
        (set) => ({
            mainWidths: [30, 50, 20],
            setMainWidths: (w) => set({ mainWidths: w }),
            clearanceHeights: [20, 30, 10, 40],
            setClearanceHeights: (h) => set({ clearanceHeights: h }),
        }),
        {
            name: "layout-storage",
        },
    ),
);

export default useSettingsStore;
