// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import MultiSectionNavBar from "@/components/common/MultiSectionNavBar";
import { cn } from "@/lib/utils";

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
        <div className={cn("p-2 md:h-full", className)}>
            <div className="m-1 w-full p-10 sm:p-20">
                <h1 className="pb-2">{title}</h1>
                <Separator />
                <div className="flex flex-col space-y-8 pt-4 lg:flex-row lg:space-x-12 lg:space-y-0">
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
                    <div className="flex-1 lg:max-w-2xl">
                        {sections.map((section) => (
                            <div
                                key={section.title}
                                className={cn(
                                    "w-full rounded-md border p-10 shadow-lg lg:p-20",
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
