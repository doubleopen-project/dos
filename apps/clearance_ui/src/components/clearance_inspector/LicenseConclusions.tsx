// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import LicenseConclusionItem from "@/components/clearance_inspector/LicenseConclusionItem";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type LicenseConclusionsProps = {
    purl: string;
    fileSha256: string;
};

const LicenseConclusions = ({ purl, fileSha256 }: LicenseConclusionsProps) => {
    const user = useUser();
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
                    {user && data.licenseConclusions?.length > 0 ? (
                        <div className="h-full w-full overflow-y-auto p-1 text-xs">
                            {data.licenseConclusions.map((license) => (
                                <LicenseConclusionItem
                                    key={license.id}
                                    license={license}
                                    user={user}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="h-full w-full overflow-auto p-1 text-xs">
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
