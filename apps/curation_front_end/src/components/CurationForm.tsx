// SPDX-FileCopyrightText: 2023 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { userAPI } from "validation-helpers";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ZodiosBodyByPath, ZodiosResponseByPath } from "@zodios/core";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CurationSPDX from "./CurationSPDX";
import CurationDB from "./CurationDB";
import CurationLicense from "./CurationLicense";

const curationFormSchema = z.object({
    fileSha256: z.string(),
    detectedLicenseExpressionSPDX: z.string().optional(),
    concludedLicenseExpressionSPDX: z.string(),
    concludedLicenseSPDX: z.string().optional(),
    concludedLicenseDB: z.string().optional(),
    concludedLicenseList: z.string().optional(),
    comment: z.string().optional(),
    contextPurl: z.string(),
});

type CurationFormType = z.infer<typeof curationFormSchema>;

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;
type LicenseConclusionPostData = ZodiosBodyByPath<
    typeof userAPI,
    "post",
    "/license-conclusion"
>;

type Props = {
    purl: string | undefined;
    fileData: DataType;
};

const CurationForm = ({ purl, fileData }: Props) => {
    const defaultValues: Partial<CurationFormType> = {
        concludedLicenseExpressionSPDX: "",
        detectedLicenseExpressionSPDX:
            fileData?.licenseConclusions[0]?.detectedLicenseExpressionSPDX ??
            "",
        contextPurl: purl,
        fileSha256: fileData?.sha256,
        comment: "",
    };
    const form = useForm<CurationFormType>({
        resolver: zodResolver(curationFormSchema),
        defaultValues,
    });

    function onSubmit(data: CurationFormType) {
        // Create an array of fields with values
        const fieldsWithValue = [
            data.concludedLicenseSPDX,
            data.concludedLicenseDB,
            data.concludedLicenseList,
        ].filter((field) => field !== undefined && field !== "");

        // If exactly one field has a value, store that into concludedLicenseExpressionSPDX
        if (fieldsWithValue.length === 1) {
            data.concludedLicenseExpressionSPDX = fieldsWithValue[0] || "";
            if (
                window.confirm(
                    `Do you want to add a license conclusion to this file:\n${JSON.stringify(
                        data.concludedLicenseExpressionSPDX,
                        null,
                        2,
                    )}`,
                )
            ) {
                console.log("Submitting curation:", data);
            } else {
                console.log("Curation cancelled.");
                return;
            }
        } else if (fieldsWithValue.length === 0) {
            alert(
                "No license conclusion (SPDX expression, from DB, from a license list) are specified. Please specify exactly one.",
            );
        } else {
            alert(
                "More than one license conclusion specified. Please specify exactly one.",
            );
        }
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
                        name="concludedLicenseDB"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <CurationDB
                                        data={fileData}
                                        concludedLicenseExpressionSPDX={
                                            field.value
                                        }
                                        setConcludedLicenseExpressionSPDX={
                                            field.onChange
                                        }
                                        fractionalWidth={0.75}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="concludedLicenseList"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <CurationLicense
                                        concludedLicenseExpressionSPDX={
                                            field.value
                                        }
                                        setConcludedLicenseExpressionSPDX={
                                            field.onChange
                                        }
                                        fractionalWidth={0.75}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="concludedLicenseSPDX"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <CurationSPDX
                                        value={field.value}
                                        setValue={field.onChange}
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
