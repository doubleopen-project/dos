// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import CopyToClipboard from "@/components/common/CopyToClipboard";

type DetectedLicenseProps = {
    fileSha256: string;
};

const DetectedLicense = ({ fileSha256 }: DetectedLicenseProps) => {
    const { data, isLoading, error } = userHooks.useGetLicenseFindingsForFile(
        {
            withCredentials: true,
            params: {
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
                    <Label className="clearance-label">Detected license</Label>
                    {data?.licenseFindings[0] ? (
                        <div className="h-full w-full overflow-auto p-1 text-xs">
                            {data.licenseFindings.map((license) => (
                                <span key={license.id}>
                                    <span className="font-bold">
                                        {
                                            new Date(license.updatedAt)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        :{" "}
                                    </span>
                                    {license.licenseExpressionSPDX}
                                    <CopyToClipboard
                                        copyText={license.licenseExpressionSPDX}
                                    />
                                    <br />
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="h-full w-full overflow-auto rounded-md p-1 text-xs">
                            No license detected
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

export default DetectedLicense;
