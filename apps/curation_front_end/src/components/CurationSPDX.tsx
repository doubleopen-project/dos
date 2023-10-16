// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Input } from "@/components/ui/input";

type Props = {
    concludedLicenseExpressionSPDX: string;
    setConcludedLicenseExpressionSPDX: (newSPDX: string | null) => void;
};

const CurationSPDX = ({
    concludedLicenseExpressionSPDX,
    setConcludedLicenseExpressionSPDX,
}: Props) => {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setConcludedLicenseExpressionSPDX(newValue);
        if (newValue === "") {
            setConcludedLicenseExpressionSPDX(null);
        }
    };

    return (
        <Input
            className="rounded-lg w-full text-xs"
            type="text"
            placeholder="Write your SPDX expression here..."
            value={concludedLicenseExpressionSPDX}
            onChange={handleInput}
        />
    );
};

export default CurationSPDX;
