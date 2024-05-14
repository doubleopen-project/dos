// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BulkConclusionEditForm from "@/components/common/edit_item/BulkConclusionEditForm";
import BulkConclusionForm from "@/components/main_ui/inspector/package_inspector/BulkConclusionForm";

type Props = {
    purl: string;
    pattern: string;
    clearPattern: () => void;
    id?: number;
    open: boolean;
    setOpen: (open: boolean) => void;
};

const BulkConclusionFormDialog = ({
    purl,
    pattern,
    clearPattern,
    id,
    open,
    setOpen,
}: Props) => {
    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
                {id ? (
                    <BulkConclusionEditForm
                        purl={purl}
                        id={id}
                        setOpen={setOpen}
                    />
                ) : (
                    <BulkConclusionForm
                        purl={purl}
                        pattern={pattern}
                        clearPattern={clearPattern}
                        setOpen={setOpen}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BulkConclusionFormDialog;
