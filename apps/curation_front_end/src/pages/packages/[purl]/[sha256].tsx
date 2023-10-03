// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
import React from 'react'

export default function PackageAndFile() {
    const router = useRouter();
    let { purl, sha256 } = router.query;

    return (
        <div>Package tree and file opened</div>
    )
}