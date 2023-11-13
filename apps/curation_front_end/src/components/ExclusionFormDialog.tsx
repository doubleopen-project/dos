// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import ExclusionForm from "@/components/ExclusionForm";
import { Button } from "@/components/ui/button";

type Props = {
    purl: string | undefined;
    pattern?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
};

const ExclusionFormDialog = ({ purl, pattern, open, setOpen }: Props) => {
    return (
        <Dialog open={open}>
            <DialogContent>
                <ExclusionForm
                    purl={purl}
                    pattern={pattern}
                    setOpen={setOpen}
                />
                <DialogFooter className="flex justify-end">
                    <Button
                        variant="outline"
                        className="text-xs p-1 rounded-md"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExclusionFormDialog;
