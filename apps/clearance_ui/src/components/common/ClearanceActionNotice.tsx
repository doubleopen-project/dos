// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useClearanceActionState } from "@/hooks/useClearanceActionState";

const ClearanceActionNotice = () => {
    const { blocker } = useClearanceActionState();

    if (blocker === "NO_PERMISSION") {
        return (
            <div className="mr-1 mb-1 rounded-md bg-red-100 p-1 text-xs">
                Feel free to interact with the form but please note that you do
                not currently have permission to add clearances.
            </div>
        );
    }

    return null;
};

export default ClearanceActionNotice;
