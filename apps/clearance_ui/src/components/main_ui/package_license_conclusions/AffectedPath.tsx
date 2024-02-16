// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";

type Props = {
    path: string;
};

const AffectedPath = ({ path }: Props) => {
    return <span className="ml-10 break-all text-xs">{path}</span>;
};

export default AffectedPath;
