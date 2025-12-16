// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { ZodiosResponseByAlias } from "@zodios/core";
import { userAPI } from "validation-helpers";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Group = ZodiosResponseByAlias<
    typeof userAPI,
    "GetUserClearanceGroups"
>["writer"][0];

type State = {
    selectedClearanceGroup: Group | undefined;
};

type Actions = {
    setSelectedClearanceGroup: (group: Group | undefined) => void;
};

const useContextStore = create<State & Actions>()(
    persist(
        (set) => ({
            selectedClearanceGroup: undefined,
            setSelectedClearanceGroup: (group) =>
                set({ selectedClearanceGroup: group }),
        }),
        {
            name: "context-storage",
        },
    ),
);

export default useContextStore;
