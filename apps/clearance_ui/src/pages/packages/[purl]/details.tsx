// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { PackageURL } from "packageurl-js";
import useMainUiStore from "@/store/mainui.store";
import ClearanceToolbar from "@/components/ClearanceToolbar";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

const Details = () => {
    const purl = useMainUiStore((state) => state.purl);

    const parsedPurl = parsePurlAndQualifiers(purl);
    const mainPurl = new PackageURL(
        parsedPurl.type,
        parsedPurl.namespace,
        parsedPurl.name,
        parsedPurl.version,
        null,
        null,
    ).toString();

    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <div className="flex-1 border p-2">
                <div className="px-4 sm:px-0">
                    <h3 className="font-semibold">Package Information</h3>
                    <p className="mt-1 max-w-2xl text-sm">
                        Details about package and its provenance.
                    </p>
                </div>
                <div className="mt-6 rounded-lg border p-2">
                    <dl className="">
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm font-semibold leading-6">
                                Name:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {parsedPurl.name}
                            </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm font-semibold leading-6">
                                Version:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {parsedPurl.version}
                            </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm font-semibold leading-6">
                                Type:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {parsedPurl.type}
                            </dd>
                        </div>
                        {parsedPurl.namespace && (
                            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-right text-sm font-semibold leading-6">
                                    Namespace:
                                </dt>
                                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                    {parsedPurl.namespace}
                                </dd>
                            </div>
                        )}
                        {parsedPurl.subpath && (
                            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-right text-sm font-semibold leading-6">
                                    Subpath:
                                </dt>
                                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                    {parsedPurl.subpath}
                                </dd>
                            </div>
                        )}
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm font-semibold leading-6">
                                Clean PURL:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {mainPurl}
                            </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm font-semibold leading-6">
                                Full PURL:
                            </dt>
                            <dd className="mt-1 break-all text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {purl}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Details;
