// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiSectionNavBarProps extends React.HTMLAttributes<HTMLElement> {
    defaultSection: string;
    items: {
        title: string;
        tag: string;
        href: string;
    }[];
}

const MultiSectionNavBar = ({
    className,
    defaultSection,
    items,
    ...props
}: MultiSectionNavBarProps) => {
    const searchParams = useSearchParams();
    const section = searchParams.get("section") || defaultSection;

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0",
                className,
            )}
            {...props}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        section === item.tag ? "bg-accent" : undefined,
                        "justify-start",
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
};

export default MultiSectionNavBar;
