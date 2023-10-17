// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Input } from "@/components/ui/input";

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
            className="rounded-lg w-full text-xs"
            type="text"
            placeholder="Write your SPDX expression here..."
            value={value}
            onChange={handleInput}
        />
    );
};

export default CurationSPDX;
