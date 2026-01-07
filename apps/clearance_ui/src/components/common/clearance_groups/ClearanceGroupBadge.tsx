// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { clearanceGroupColor } from "@/helpers/stringToColour";

const ClearanceGroupBadge = ({
    clearanceGroup,
}: {
    clearanceGroup: {
        id: number;
        name: string;
    };
}) => {
    return (
        <div
            className="rounded-sm p-1 text-xs font-semibold"
            style={{
                backgroundColor: clearanceGroupColor(clearanceGroup.name),
            }}
        >
            {clearanceGroup.name}
        </div>
    );
};

export default ClearanceGroupBadge;
