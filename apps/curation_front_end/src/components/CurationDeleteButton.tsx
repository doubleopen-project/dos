// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { userHooks } from "@/hooks/zodiosHooks";
import { Loader2 } from "lucide-react";

type Props = {
    id: number;
    data: string;
};

const CurationDeleteButton = ({ id, data }: Props) => {
    const { mutate: deleteLicenseConclusion, isLoading } = userHooks.useDelete(
        "/license-conclusion/:id",
        {
            withCredentials: true,
            params: {
                id: id,
            },
        },
        {
            onSuccess: (data) => {
                alert("Curation deleted successfully.");
            },
            onError: () => {
                alert("Something went wrong. Please try again.");
            },
        },
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 mr-2 animate-spin" />
            </div>
        );
    }

    const handleDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete curation ${data} from this file?`,
            )
        ) {
            deleteLicenseConclusion(undefined);
        }
    };

    return (
        <Button key={id} className="px-2" onClick={() => handleDelete()}>
            <Delete></Delete>
        </Button>
    );
};

export default CurationDeleteButton;
