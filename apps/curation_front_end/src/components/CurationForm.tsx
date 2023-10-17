// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    curationFormSchema,
    CurationFormType,
    userAPI,
} from "validation-helpers";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ZodiosBodyByPath, ZodiosResponseByPath } from "@zodios/core";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CurationSPDX from "./CurationSPDX";

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;
type LicenseConclusionPostData = ZodiosBodyByPath<
    typeof userAPI,
    "post",
    "/license-conclusion"
>;

type Props = {
    purl: string | undefined;
    fileData?: DataType;
};

const CurationForm = ({ purl, fileData }: Props) => {
    const defaultValues: Partial<CurationFormType> = {
        detectedLicenseExpressionSPDX:
            fileData?.licenseConclusions[0]?.detectedLicenseExpressionSPDX ??
            "",
        contextPurl: purl,
        fileSha256: fileData?.sha256,
    };
    const form = useForm<CurationFormType>({
        resolver: zodResolver(curationFormSchema),
        defaultValues,
    });

    useEffect(() => {
        console.log("CurationForm state has changed:", form.getValues());
    }, [form.getValues()]);
    console.log("CurationForm defaultValues:", defaultValues);
    function onSubmit(data: CurationFormType) {
        console.log(JSON.stringify(data, null, 2));
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    return (
        <div className="flex flex-col w-full">
            <Label className="font-bold mb-2">Curation:</Label>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="concludedLicenseExpressionSPDX"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    {/*
                                    <CurationSPDX
                                        value={field.value}
                                        setValue={field.onChange}
                                    />
                                    */}
                                    <Input
                                        placeholder="SPDX expression..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Comment on your curation..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit curation</Button>
                </form>
            </Form>
        </div>
    );
};

export default CurationForm;
