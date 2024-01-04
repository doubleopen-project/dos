// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Loader2 } from "lucide-react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import ConclusionForm from "@/components/license_conclusions/ConclusionForm";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type ConclusionFormWrapperProps = {
    purl: string;
    fileSha256: string;
};

const ConclusionFormWrapper = ({
    purl,
    fileSha256,
}: ConclusionFormWrapperProps) => {
    const {
        data: licenseConclusionData,
        isLoading: lcIsLoading,
        error: lcError,
    } = userHooks.useGetLicenseConclusionsForFileInPackage(
        {
            withCredentials: true,
            params: {
                purl: toPathPurl(purl),
                sha256: fileSha256,
            },
        },
        { enabled: !!fileSha256 },
    );

    const {
        data: licenseFindingData,
        isLoading: lfIsLoading,
        error: lfError,
    } = userHooks.useGetLicenseFindingsForFile(
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
            {lcIsLoading && lfIsLoading && (
                <div className="flex h-full items-center justify-center p-6">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            {licenseConclusionData && licenseFindingData && (
                <div className="flex h-full w-full flex-col items-start p-1">
                    <Label className="m-1 font-semibold">
                        Create a license conclusion
                    </Label>
                    <div className="h-full w-full overflow-y-auto rounded-md border p-1">
                        <ConclusionForm
                            purl={purl}
                            fileSha256={fileSha256}
                            lcData={licenseConclusionData}
                            detectedExpression={
                                licenseFindingData.licenseFindings.length > 0
                                    ? licenseFindingData.licenseFindings[0]
                                          .licenseExpressionSPDX
                                    : undefined
                            }
                        />
                    </div>
                </div>
            )}
            {(lcError || lfError) && (
                <div className="flex h-full items-center justify-center">
                    <p className="text-red-500">
                        Error fetching license conclusions
                    </p>
                </div>
            )}
        </>
    );
};

export default ConclusionFormWrapper;
