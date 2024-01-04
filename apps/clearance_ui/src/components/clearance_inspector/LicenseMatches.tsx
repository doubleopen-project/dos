// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import ButtonGroup from "@/components/clearance_inspector/ButtonGroup";

type DetectedLicenseProps = {
    fileSha256: string;
};

const LicenseMatches = ({ fileSha256 }: DetectedLicenseProps) => {
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
                    <Label className="m-1 font-semibold">
                        Individual license matches
                    </Label>
                    {data?.licenseFindings[0]?.licenseFindingMatches ? (
                        <ButtonGroup
                            data={data.licenseFindings[0].licenseFindingMatches}
                            className="h-full w-full overflow-y-auto rounded-md border p-1"
                        />
                    ) : (
                        <p className="h-full w-full overflow-auto rounded-md border p-1 text-xs">
                            No license matches
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

export default LicenseMatches;
