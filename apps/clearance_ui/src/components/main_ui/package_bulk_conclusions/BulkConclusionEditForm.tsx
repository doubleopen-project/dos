// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ZodiosResponseByAlias } from "@zodios/core";
import axios from "axios";
import isGlob from "is-glob";
import { Info, Loader2 } from "lucide-react";
import { useForm, useFormState } from "react-hook-form";
import { AiOutlineEye } from "react-icons/ai";
import { userAPI } from "validation-helpers";
import { z } from "zod";
import { userHooks } from "@/hooks/zodiosHooks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { concludedLicenseExpressionSPDXSchema } from "@/components/license_conclusions/ConclusionForm";
import ConclusionLicense from "@/components/license_conclusions/ConclusionLicense";
import ConclusionSPDX from "@/components/license_conclusions/ConclusionSPDX";
import { findMatchingPaths } from "@/helpers/findMatchingPaths";
import { toPathPurl } from "@/helpers/pathParamHelpers";
import { cn } from "@/lib/utils";

const bulkConclusionFormSchema = z.object({
    pattern: z
        .string()
        .min(1, "Pattern cannot be empty")
        .refine((pattern) => isGlob(pattern), {
            message: "Pattern is not a valid glob pattern",
        })
        .refine((pattern) => pattern !== "**", {
            message:
                "You cannot do a bulk conclusion for all files in a package",
        }),
    concludedLicenseSPDX: concludedLicenseExpressionSPDXSchema,
    concludedLicenseList: concludedLicenseExpressionSPDXSchema,
    comment: z.string(),
    local: z.boolean(),
});

type BulkConclusionFormType = z.infer<typeof bulkConclusionFormSchema>;

type BulkConclusion = ZodiosResponseByAlias<
    typeof userAPI,
    "GetBulkConclusionsByPurl"
>["bulkConclusions"][0];

type Props = {
    pathPurl: string;
    bulkConclusion: BulkConclusion;
    editHandler: (id: number) => void;
};

const BulkConclusionEditForm = ({
    pathPurl,
    bulkConclusion,
    editHandler,
}: Props) => {
    const [matchingPaths, setMatchingPaths] = useState<string[]>([]);

    // Fetch the package file tree data
    const { data: fileTreeData } = userHooks.useGetFileTree({
        withCredentials: true,
        params: {
            purl: pathPurl,
        },
    });
    const paths =
        fileTreeData?.filetrees.map((filetree) => filetree.path) || [];
    const defaultValues: BulkConclusionFormType = {
        pattern: "",
        concludedLicenseSPDX: "",
        concludedLicenseList: "",
        comment: "",
        local: false,
    };
    const form = useForm<BulkConclusionFormType>({
        resolver: zodResolver(bulkConclusionFormSchema),
        defaultValues,
    });
    const { errors } = useFormState({ control: form.control });

    return <div>BulkConclusionEditForm</div>;
};

export default BulkConclusionEditForm;
