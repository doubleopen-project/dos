// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { userHooks } from "@/hooks/zodiosHooks";
import { Label } from "@/components/ui/label";
import LicenseConclusionItem from "@/components/main_ui/inspector/clearance_inspector/LicenseConclusionItem";
import BulkConclusionFormDialog from "@/components/main_ui/inspector/package_inspector/BulkConclusionFormDialog";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { toPathPurl } from "@/helpers/pathParamHelpers";

type LicenseConclusionsProps = {
    purl: string;
    fileSha256: string;
};

const LicenseConclusions = ({ purl, fileSha256 }: LicenseConclusionsProps) => {
    const session = useSession();
    const [editBCId, setEditBCId] = useState<number | null>(null);
    const [contextPurl, setContextPurl] = useState<string | null>(null);
    const { data, isLoading, error } =
        userHooks.useGetLicenseConclusionsForFileInPackage(
            {
                headers: {
                    Authorization: `Bearer ${session.data?.accessToken}`,
                },
                params: {
                    purl: toPathPurl(purl),
                    sha256: fileSha256,
                },
            },
            { enabled: !!fileSha256 },
        );
    const setOpenEditDialog = (open: boolean) => {
        if (!open) {
            setEditBCId(null);
            setContextPurl(null);
        }
    };
    const onEditItem = (id: number, contextPurl: string) => {
        setEditBCId(id);
        setContextPurl(contextPurl);
    };

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
                        <div className="h-full w-full overflow-y-auto p-1 text-xs">
                            {data.licenseConclusions.map((license) => (
                                <LicenseConclusionItem
                                    key={license.id}
                                    license={license}
                                    onEditItem={onEditItem}
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
                <div className="mx-4 flex h-full items-center justify-center font-semibold text-red-500">
                    <span>Error: {getErrorMessage(error)}</span>
                </div>
            )}
            {/*Adding the pattern and clearPattern props here to get rid of ts error,
            perhaps these should be changed to optional props or something else should be
            done about the BulkConclusionFormDialog component though*/}
            {contextPurl && editBCId && (
                <BulkConclusionFormDialog
                    purl={contextPurl}
                    id={editBCId || undefined}
                    open={editBCId !== null}
                    setOpen={setOpenEditDialog}
                    pattern=""
                    clearPattern={() => void 0}
                />
            )}
        </>
    );
};

export default LicenseConclusions;
