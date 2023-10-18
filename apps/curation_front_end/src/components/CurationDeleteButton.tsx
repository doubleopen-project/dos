// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line as Delete } from "react-icons/ri";
import { userHooks } from "@/hooks/zodiosHooks";

type Props = {
    id: number;
    data: string;
};

const CurationDeleteButton = ({ id, data }: Props) => {
    const {
        mutate: deleteLicenseConclusion,
        error,
        isSuccess,
    } = userHooks.useDelete("/license-conclusion/:id", {
        withCredentials: true,
        params: {
            id: id.toString(),
        },
    });

    if (isSuccess) {
        alert("Curation deleted.");
    } else if (error) {
        alert("Failed to delete curation: " + error.message);
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
