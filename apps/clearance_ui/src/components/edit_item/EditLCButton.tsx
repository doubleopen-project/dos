// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditLCButton = () => {
    return (
        <Button variant="outline" className="mr-1 px-2">
            <Pencil size={16}></Pencil>
        </Button>
    );
};

export default EditLCButton;
