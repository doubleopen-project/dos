// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import MultiSectionNavBar from "./MultiSectionNavBar";

interface MultiSectionProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    defaultSection: string;
    sections: {
        title: string;
        tag: string;
        href: string;
        content: React.FC;
    }[];
}

const MultiSection = ({
    className,
    title,
    defaultSection,
    sections,
}: MultiSectionProps) => {
    const searchParams = useSearchParams();
    const searchParamSection = searchParams.get("section") || defaultSection;

    return (
        <div className={cn("p-2 md:h-screen", className)}>
            <div className="w-full h-full p-10 m-1 border rounded-md shadow-lg sm:p-20">
                <h1 className="pb-2">{title}</h1>
                <Separator />
                <div className="flex flex-col pt-4 space-y-8 md:h-full lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="lg:w-1/5">
                        <MultiSectionNavBar
                            defaultSection={defaultSection}
                            items={sections.map((section) => ({
                                title: section.title,
                                tag: section.tag,
                                href: section.href,
                            }))}
                        />
                    </aside>
                    <div className="flex-1 overflow-hidden lg:max-w-2xl">
                        {sections.map((section) => (
                            <div
                                key={section.title}
                                className={cn(
                                    "w-full p-10 overflow-auto border rounded-md shadow-lg h-5/6 lg:h-full md:h-full sm:h-5/6 lg:p-20",
                                    searchParamSection === section.tag
                                        ? "visible"
                                        : "hidden",
                                )}
                            >
                                <h2>{section.title}</h2>
                                <section.content />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiSection;
