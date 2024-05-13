// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import ButtonGroup from "@/components/main_ui/inspector/clearance_inspector/ButtonGroup";
import { getErrorMessage } from "@/helpers/getErrorMessage";

type DetectedLicenseProps = {
    fileSha256: string;
};

const LicenseMatches = ({ fileSha256 }: DetectedLicenseProps) => {
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
                    <Label className="clearance-label">
                        Individual license matches
                    </Label>
                    {data?.licenseFindings[0]?.licenseFindingMatches ? (
                        <ButtonGroup
                            data={data.licenseFindings[0].licenseFindingMatches}
                            className="h-full w-full overflow-y-auto p-1"
                        />
                    ) : (
                        <p className="h-full w-full overflow-auto rounded-md p-1 text-xs">
                            No license matches
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

export default LicenseMatches;
