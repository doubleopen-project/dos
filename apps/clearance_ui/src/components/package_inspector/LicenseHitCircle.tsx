// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const stringToLinesOfText = (text: string, maxLineLength: number) => {
    const lines: string[] = [];
    let line = "";
    let lineLength = 0;
    const words = text.split(" ");
    for (const word of words) {
        if (lineLength + word.length > maxLineLength) {
            lines.push(line);
            line = "";
            lineLength = 0;
        }
        line += `${word} `;
        lineLength += word.length + 1;
    }
    lines.push(line);
    return lines;
};

type LicenseHitCircleProps = {
    license: string;
    bgcolor: string;
    filtered: boolean;
};
const LicenseHitCircle = ({
    license,
    bgcolor,
    filtered,
}: LicenseHitCircleProps) => {
    const lines = stringToLinesOfText(license, 40);
    const linesCount = lines.length;
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="ml-1" type="button">
                    <span
                        className={cn(
                            filtered ? "h-3 w-3" : "h-2 w-2",
                            "flex items-center justify-center rounded-full",
                        )}
                        style={{ backgroundColor: bgcolor }}
                    ></span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                    <div
                        className="w-full p-1"
                        style={{ height: linesCount * 2 + "rem" }}
                    >
                        {lines.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default LicenseHitCircle;
