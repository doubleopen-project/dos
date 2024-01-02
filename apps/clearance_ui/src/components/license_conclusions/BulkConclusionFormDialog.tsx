// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import BulkConclusionForm from "@/components/license_conclusions/BulkConclusionForm";

type Props = {
    purl: string;
    open: boolean;
    setOpen: (open: boolean) => void;
};

const BulkConclusionFormDialog = ({ purl, open, setOpen }: Props) => {
    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
                <BulkConclusionForm purl={purl} setOpen={setOpen} />
                <DialogFooter className="flex justify-end">
                    <Button
                        variant="outline"
                        className="rounded-md p-1 text-xs"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BulkConclusionFormDialog;
