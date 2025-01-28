// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import Link from "next/link";

type Props = {
    purl: string;
    path: string;
};

const AffectedPath = ({ purl, path }: Props) => {
    return (
        <Link
            className="font-semibold text-blue-400"
            href={`/packages/${encodeURIComponent(purl)}${
                path ? `/tree/${encodeURIComponent(path)}` : ""
            }`}
        >
            <div className="ml-10 text-xs break-all hover:font-extrabold">
                {path}
            </div>
        </Link>
    );
};

export default AffectedPath;
