// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useRouter } from "next/router";
import PackageTree from '@/components/PackageTree';
import CodeInspector from '@/components/CodeInspector';
import { zodiosHooks } from "@/hooks/zodiosHooks";

export default function PackageAndFile() {
    const router = useRouter();
    let { sha256 } = router.query;
    //const { data, isLoading, error } = zodiosHooks.useImmutableQuery('/file', { sha256: sha256 as string }, undefined, { enabled: !!sha256 });

    return (
        <div>Package tree and file opened</div>
    )
}