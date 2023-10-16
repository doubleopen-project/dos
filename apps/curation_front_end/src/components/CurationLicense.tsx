// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import * as yaml from "js-yaml";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";

type Props = {
    concludedLicenseExpressionSPDX: string;
    setConcludedLicenseExpressionSPDX: (newSPDX: string | null) => void;
    fractionalWidth?: number;
};

const fetchAndConvertYAML = async (): Promise<any> => {
    const response = await fetch(
        "https://raw.githubusercontent.com/doubleopen-project/policy-configuration/main/license-classifications.yml",
    );
    if (response.ok) {
        const yamlText = await response.text();
        const jsonData = yaml.load(yamlText) as {
            categorizations: { id: string }[];
        };
        const ids = jsonData.categorizations.map((item) => item.id);
        const sortedIds = ids.sort((a, b) => a.localeCompare(b));
        return sortedIds;
    } else {
        throw new Error(
            `Failed to fetch YAML file: ${response.status} ${response.statusText}`,
        );
    }
};

const CurationLicense = ({
    concludedLicenseExpressionSPDX,
    setConcludedLicenseExpressionSPDX,
    fractionalWidth = 0.75,
}: Props) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [listWidth, setListWidth] = useState(0);
    const [value, setValue] = useState<string | null>(
        concludedLicenseExpressionSPDX,
    );
    const router = useRouter();

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.offsetWidth;
            setListWidth(width * fractionalWidth);
        }
    }, [buttonRef.current?.offsetWidth]); // Re-run effect if the button's size changes

    // Fetch the license classifications from Github
    const { data, isLoading, error } = useQuery({
        queryKey: ["license-classifications"],
        queryFn: fetchAndConvertYAML,
        staleTime: 60 * 60 * 1000, // 1 hour
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    // Map data to the format required by the Command component
    const dataAsArray = Array.from(data as Set<string>).map((d) => ({
        value: d.toLowerCase(),
        label: d,
    }));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-fit justify-between"
                >
                    <div className="text-xs">
                        {router.isReady
                            ? value
                                ? dataAsArray.find((d) => d.value === value)
                                      ?.label
                                : "Select license..."
                            : null}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: listWidth }}>
                <Command>
                    <CommandInput placeholder="Search license..." />
                    <CommandEmpty>No license found.</CommandEmpty>
                    <CommandGroup className="max-h-[70vh] min-h-[1px] w-full overflow-y-auto">
                        {dataAsArray.map((d, index) => (
                            <CommandItem
                                key={`${d.value}-${index}`} // Combining value with index
                                className="items-start text-left"
                                onSelect={(currentValue) => {
                                    if (currentValue === value) {
                                        // Unselect the current value
                                        setValue(null);
                                        setConcludedLicenseExpressionSPDX(null);
                                    } else {
                                        const selectedData = dataAsArray.find(
                                            (d) => d.value === currentValue,
                                        );
                                        const newLabel = selectedData
                                            ? selectedData.label
                                            : null;

                                        setValue(currentValue); // Update component state
                                        setConcludedLicenseExpressionSPDX(
                                            newLabel,
                                        ); // Update parent state
                                    }
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === d.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                                <div className="text-xs">{d.label}</div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CurationLicense;
