// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const PasswordTooltip = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="ml-1" type="button">
                    <Info size={"15px"} />
                </TooltipTrigger>
                <TooltipContent side="right">
                    Password should have:
                    <ul className="list-inside list-disc">
                        <li>at least 8 characters</li>
                        <li>at least one uppercase letter</li>
                        <li>at least one lowercase letter</li>
                        <li>at least one number</li>
                        <li>at least one special character</li>
                    </ul>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default PasswordTooltip;
