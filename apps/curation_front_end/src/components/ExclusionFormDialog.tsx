// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import ExclusionForm from "@/components/ExclusionForm";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type Props = {
    purl: string | undefined;
    pattern?: string;
};

const ExclusionFormDialog = ({ purl, pattern }: Props) => {
    return (
        <DialogContent>
            <ExclusionForm purl={purl} pattern={pattern} />
            <DialogFooter className="flex justify-end">
                <DialogClose asChild>
                    <Button
                        variant="outline"
                        className="text-xs p-1 rounded-md"
                    >
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

export default ExclusionFormDialog;
