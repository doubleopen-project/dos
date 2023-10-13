// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect } from "react";
import { parseAsString, useQueryState } from "next-usequerystate";
import { Input } from "@/components/ui/input";

type Props = {
    filterString: string;
    selectText?: string;
};

const CurationSPDX = ({ filterString, selectText }: Props) => {
    const [value, setValue] = useQueryState(
        filterString,
        parseAsString.withDefault(""),
    );

    // Clean up the URL when component unmounted
    useEffect(() => {
        return () => {
            setValue(null);
        };
    }, []);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        if (event.target.value === "") {
            setValue(null);
        }
    };

    return (
        <Input
            className="rounded-lg w-full text-xs"
            type="text"
            placeholder={selectText}
            value={value}
            onChange={handleInput}
        />
    );
};

export default CurationSPDX;
