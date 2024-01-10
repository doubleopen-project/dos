// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Pencil } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    name: string;
    className?: string;
    iconSize?: number;
    variant?: ButtonProps["variant"];
};

const EditButton = ({ onClick, name, className, iconSize, variant }: Props) => {
    return (
        <Button
            variant={variant || "outline"}
            className={className}
            onClick={onClick}
            name={name}
            aria-label={name}
        >
            <Pencil size={iconSize || 16} />
        </Button>
    );
};

export default EditButton;
