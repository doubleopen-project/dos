// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type LicenseConclusionsProps = {
    purl: string;
    fileSha256: string;
};

const LicenseConclusions = ({ purl, fileSha256 }: LicenseConclusionsProps) => {
    const { data, isLoading, error } =
        userHooks.useGetLicenseConclusionsForFileInPackage(
            {
                withCredentials: true,
                params: {
                    purl: toPathPurl(purl),
                    sha256: fileSha256,
                },
            },
            { enabled: !!fileSha256 },
        );

    return (
        <>
            {isLoading && (
                <div className="flex h-full items-center justify-center p-6">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            {data && (
                <div className="flex h-full w-full flex-col items-start p-1">
                    <Label className="clearance-label">Concluded license</Label>
                    {data.licenseConclusions?.length > 0 ? (
                        <p className="h-full w-full overflow-y-auto rounded-md border p-1 text-xs">
                            {data.licenseConclusions.map((license) => (
                                <span key={license.id}>
                                    <>
                                        {
                                            new Date(license.updatedAt)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        :{" "}
                                        {license.concludedLicenseExpressionSPDX}
                                        <br />
                                    </>
                                </span>
                            ))}
                        </p>
                    ) : (
                        <p className="h-full w-full overflow-auto rounded-md border p-1 text-xs">
                            No license conclusions
                        </p>
                    )}
                </div>
            )}
            {error && (
                <div className="flex h-full items-center justify-center">
                    <span className="font-semibold">{error.message}</span>
                </div>
            )}
        </>
    );
};

export default LicenseConclusions;
