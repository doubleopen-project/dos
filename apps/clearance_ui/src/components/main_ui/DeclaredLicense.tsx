// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { toPathPurl } from "@/helpers/pathParamHelpers";

const DeclaredLicense = ({ purl }: { purl: string }) => {
    const { data, isLoading, error } = userHooks.useGetPackage({
        params: {
            purl: toPathPurl(purl),
        },
    });
    return (
        <div className="flex w-full flex-col items-start overflow-auto p-2 pb-8">
            <Label className="rounded-sm p-0.5 font-bold text-[#ff3366]">
                Declared license
            </Label>
            {isLoading && <Loader2 className="animate-spin" size={16} />}
            {data && (
                <div className="h-full w-full overflow-auto p-1 text-xs font-bold">
                    {data.declaredLicenseSPDX
                        ? data.declaredLicenseSPDX
                        : "N/A"}
                </div>
            )}
            {error && (
                <div className="mx-4 flex h-full items-center justify-center font-semibold text-red-500">
                    <span>Error: {getErrorMessage(error)}</span>
                </div>
            )}
        </div>
    );
};

export default DeclaredLicense;
