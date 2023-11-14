// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
    value: string | undefined;
    setValue: (newSPDX: string) => void;
};

const CurationSPDX = ({ value, setValue }: Props) => {
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <Input
            className="w-full text-xs rounded-md"
            type="text"
            placeholder="Write your SPDX expression here..."
            value={value}
            onChange={handleInput}
        />
    );
};

export default CurationSPDX;
