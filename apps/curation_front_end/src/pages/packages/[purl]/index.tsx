// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
import CurationUI from "@/components/CurationUI";

export default function Package() {
    const router = useRouter();
    let { purl } = router.query;

    // If purl has /@ in a row, the characters should be changed to /%40
    // This is because in the purl spec, @ is used to separate the package name and the version

    purl = purl?.toString().replace(/\/@/g, "/%40");

    return (
        <div className="bg-gray-200 h-screen">
            <CurationUI purl={purl} path={undefined} />
        </div>
    );
}
