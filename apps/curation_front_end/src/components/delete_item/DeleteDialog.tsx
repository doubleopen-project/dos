// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteAction } from "@/types";

type Props = {
    deleteActions: DeleteAction[];
};

const DeleteDialog = ({ deleteActions }: Props) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="px-2">
                    <Delete></Delete>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteActions?.map(({ message }) => (
                            <div key={message}>{message}</div>
                        ))}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {deleteActions?.map(({ actionTxt, onActionClick }) => (
                        <AlertDialogAction
                            key={actionTxt}
                            onClick={() => {
                                onActionClick(actionTxt);
                            }}
                        >
                            {actionTxt}
                        </AlertDialogAction>
                    ))}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;
