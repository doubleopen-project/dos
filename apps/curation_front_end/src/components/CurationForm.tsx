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
import { ZodiosResponseByPath } from "@zodios/core";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CurationSPDX from "./CurationSPDX";
import CurationDB from "./CurationDB";
import CurationLicense from "./CurationLicense";
import { userHooks } from "@/hooks/zodiosHooks";
import { useQueryClient } from "@tanstack/react-query";

const curationFormSchema = z.object({
    concludedLicenseSPDX: z.string(),
    concludedLicenseDB: z.string(),
    concludedLicenseList: z.string(),
    comment: z.string(),
});

type CurationFormType = z.infer<typeof curationFormSchema>;

type DataType = ZodiosResponseByPath<typeof userAPI, "post", "/file">;

type Props = {
    purl: string;
    fileData: DataType;
};

const CurationForm = ({ purl, fileData }: Props) => {
    const defaultValues: CurationFormType = {
        concludedLicenseSPDX: "",
        concludedLicenseDB: "",
        concludedLicenseList: "",
        comment: "",
    };

    const form = useForm<CurationFormType>({
        resolver: zodResolver(curationFormSchema),
        defaultValues,
    });

    const key = userHooks.getKeyByPath("post", "/file");
    const queryClient = useQueryClient();
    const { mutate: addLicenseConclusion } = userHooks.useMutation(
        "post",
        "/license-conclusion",
        {
            withCredentials: true,
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(key);
            },
        },
    );

    function onSubmit(data: CurationFormType) {
        // Create an array of fields with values
        console.log(data);

        const fieldsWithValue = [
            data.concludedLicenseSPDX,
            data.concludedLicenseDB,
            data.concludedLicenseList,
        ].filter((field) => field !== undefined && field !== "");

        // If exactly one field has a value, store that into concludedLicenseExpressionSPDX
        if (fieldsWithValue.length === 1) {
            const concludedLicenseExpressionSPDX = fieldsWithValue[0] || "";
            if (
                window.confirm(
                    `Do you want to add a license conclusion\n${JSON.stringify(
                        concludedLicenseExpressionSPDX,
                        null,
                        2,
                    )}to this file\n${JSON.stringify(
                        fileData.sha256,
                        null,
                        2,
                    )}`,
                )
            ) {
                addLicenseConclusion({
                    fileSha256: fileData.sha256,
                    concludedLicenseExpressionSPDX:
                        concludedLicenseExpressionSPDX,
                    detectedLicenseExpressionSPDX:
                        fileData.licenseFindings[0]?.licenseExpressionSPDX ??
                        "",
                    comment: data.comment ?? "",
                    contextPurl: purl,
                });

                //addLicenseConclusion(data as LicenseConclusionPostData);
            } else {
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
            <Label className="font-bold mb-1">Curation:</Label>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-1"
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
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem className="flex-1 mr-1">
                                    <FormControl>
                                        <Textarea
                                            className="text-xs"
                                            placeholder="Comment on your curation..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center">
                            <Button
                                type="submit"
                                className="text-left text-xs"
                                variant={"outline"}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CurationForm;
