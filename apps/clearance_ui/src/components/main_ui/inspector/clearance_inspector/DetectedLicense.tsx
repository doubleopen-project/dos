// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import CopyToClipboard from "@/components/common/CopyToClipboard";
import { getErrorMessage } from "@/helpers/getErrorMessage";

type DetectedLicenseProps = {
    fileSha256: string;
    scanner: string;
};

const DetectedLicense = ({ fileSha256, scanner }: DetectedLicenseProps) => {
    const session = useSession();
    const { data, isLoading, error } = userHooks.useGetLicenseFindingsForFile(
        {
            headers: {
                Authorization: `Bearer ${session.data?.accessToken}`,
            },
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
                    <div>
                        <Label className="px-0.5 text-xs font-bold">
                            Scanner:{" "}
                        </Label>
                        <Label className="text-xs italic">{scanner}</Label>
                    </div>
                    {data?.licenseFindings[0] ? (
                        <div className="h-full w-full overflow-auto p-1 text-xs">
                            {data.licenseFindings.map((license) => (
                                <span key={license.id}>
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
                <div className="mx-4 flex h-full items-center justify-center font-semibold text-red-500">
                    Error: {getErrorMessage(error)}
                </div>
            )}
        </>
    );
};

export default DetectedLicense;
