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
            <div className="m-1 h-full w-full rounded-md border p-10 shadow-lg sm:p-20">
                <h1 className="pb-2">{title}</h1>
                <Separator />
                <div className="flex flex-col space-y-8 pt-4 md:h-full lg:flex-row lg:space-x-12 lg:space-y-0">
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
                                    "h-5/6 w-full overflow-auto rounded-md border p-10 shadow-lg sm:h-5/6 md:h-full lg:h-full lg:p-20",
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
