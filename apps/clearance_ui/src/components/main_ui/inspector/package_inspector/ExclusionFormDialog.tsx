// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ExclusionForm from "@/components/main_ui/inspector/package_inspector/ExclusionForm";

type Props = {
    purl: string;
    mode: "Edit" | "Add";
    id?: number;
    pattern: string;
    clearPattern: () => void;
    reason?: string;
    comment?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
};

const ExclusionFormDialog = ({
    purl,
    mode,
    id,
    pattern,
    clearPattern,
    reason,
    comment,
    open,
    setOpen,
}: Props) => {
    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
                <ExclusionForm
                    purl={purl}
                    mode={mode}
                    id={id}
                    pattern={pattern}
                    clearPattern={clearPattern}
                    reason={reason}
                    comment={comment}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ExclusionFormDialog;
