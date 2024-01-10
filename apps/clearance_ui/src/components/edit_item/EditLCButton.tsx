// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    name: string;
};

const EditLCButton = ({ onClick, name }: Props) => {
    return (
        <Button
            variant="outline"
            className="mr-1 px-2"
            onClick={onClick}
            name={name}
            aria-label={name}
        >
            <Pencil size={16}></Pencil>
        </Button>
    );
};

export default EditLCButton;
