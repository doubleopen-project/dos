// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import ConclusionForm from "@/components/main_ui/inspector/clearance_inspector/ConclusionForm";
import { getErrorMessage } from "@/helpers/getErrorMessage";

type ConclusionFormWrapperProps = {
    purl: string;
    fileSha256: string;
};

const ConclusionFormWrapper = ({
    purl,
    fileSha256,
}: ConclusionFormWrapperProps) => {
    const session = useSession();

    const {
        data: licenseFindingData,
        isLoading: lfIsLoading,
        error: lfError,
    } = userHooks.useGetLicenseFindingsForFile(
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
            {lfIsLoading && (
                <div className="flex h-full items-center justify-center p-6">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            {licenseFindingData && (
                <div className="flex h-full">
                    <div className="flex w-full flex-col items-start p-1">
                        <Label className="clearance-label">
                            Create a license conclusion
                        </Label>
                        <div className="w-full p-1">
                            <ConclusionForm
                                purl={purl}
                                fileSha256={fileSha256}
                                detectedExpression={
                                    licenseFindingData.licenseFindings.length >
                                    0
                                        ? licenseFindingData.licenseFindings[0]
                                              .licenseExpressionSPDX
                                        : undefined
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
            {lfError && (
                <div className="mx-4 flex h-full items-center justify-center font-semibold text-red-500">
                    Error: {getErrorMessage(lfError)}
                </div>
            )}
        </>
    );
};

export default ConclusionFormWrapper;
