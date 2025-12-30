// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useUser } from "@/hooks/useUser";
import useContextStore from "@/store/context.store";
import { hasPermission } from "@/helpers/hasPermission";

type ClearanceActionBlocker = "NO_PERMISSION" | "NO_GROUP" | null;

export const useClearanceActionState = () => {
    const user = useUser();
    const selectedGroup = useContextStore((s) => s.selectedClearanceGroup);

    let blocker: ClearanceActionBlocker = null;

    if (
        !user ||
        !user.permissions ||
        !hasPermission(user.permissions, "ClearanceItems", "POST")
    ) {
        blocker = "NO_PERMISSION";
    } else if (selectedGroup === undefined) {
        blocker = "NO_GROUP";
    }

    return {
        canSubmit: blocker === null,
        blocker,
    };
};
