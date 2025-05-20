// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PackageURL } from "packageurl-js";
import { useUser } from "@/hooks/useUser";
import ClearanceToolbar from "@/components/main_ui/ClearanceToolbar";
import { getProvenanceType } from "@/helpers/getProvenanceType";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

const Details = () => {
    const router = useRouter();
    const purl = router.query.purl;
    const user = useUser();
    const session = useSession({
        required: true,
    });

    useEffect(() => {
        if (session.data?.error === "SessionNotActiveError") {
            signOut();
        } else if (session.data?.error !== undefined) {
            signIn("keycloak");
        }
    }, [session.data?.error]);

    if (!purl || !user) {
        return <div>Loading...</div>;
    }
    if (typeof purl !== "string") {
        return <div>Invalid purl</div>;
    }

    // purl exists and is of correct type, so we can continue

    const parsedPurl = parsePurlAndQualifiers(purl);
    const mainPurl = new PackageURL(
        parsedPurl.type,
        parsedPurl.namespace,
        parsedPurl.name,
        parsedPurl.version,
        null,
        null,
    ).toString();
    const provenanceType = getProvenanceType(purl);

    return (
        <div className="flex h-full flex-col">
            <ClearanceToolbar />
            <div className="flex-1 border p-2">
                <div className="px-4 sm:px-0">
                    <h3 className="mt-2 font-semibold">Package Information</h3>
                    <p className="mt-1 max-w-2xl text-sm">
                        Details about package and its provenance.
                    </p>
                </div>
                <div className="mt-4 rounded-lg border p-2">
                    <dl>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm leading-6 font-semibold">
                                Name:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 font-bold sm:col-span-2 sm:mt-0">
                                {parsedPurl.name}
                            </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm leading-6 font-semibold">
                                Version:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {parsedPurl.version}
                            </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm leading-6 font-semibold">
                                Type:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {parsedPurl.type}
                            </dd>
                        </div>
                        {parsedPurl.namespace && (
                            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-right text-sm leading-6 font-semibold">
                                    Namespace:
                                </dt>
                                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                    {parsedPurl.namespace}
                                </dd>
                            </div>
                        )}
                        {parsedPurl.subpath && (
                            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-right text-sm leading-6 font-semibold">
                                    Subpath:
                                </dt>
                                <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                    {parsedPurl.subpath}
                                </dd>
                            </div>
                        )}
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm leading-6 font-semibold">
                                Clean PURL:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                {mainPurl}
                            </dd>
                        </div>
                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm leading-6 font-semibold">
                                Full PURL:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 break-all sm:col-span-2 sm:mt-0">
                                {purl}
                            </dd>
                        </div>
                        {parsedPurl.qualifiers &&
                            Object.entries(parsedPurl.qualifiers).map(
                                ([key, value]) => (
                                    <div
                                        className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                                        key={key}
                                    >
                                        <dt className="text-right text-sm leading-6 font-semibold">
                                            {key}:
                                        </dt>
                                        <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                                            {key.includes("_url") ? (
                                                <Link
                                                    className="font-semibold text-blue-400"
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    href={value}
                                                >
                                                    {value}
                                                </Link>
                                            ) : (
                                                value
                                            )}
                                        </dd>
                                    </div>
                                ),
                            )}

                        <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-right text-sm leading-6 font-semibold">
                                Provenance type:
                            </dt>
                            <dd className="mt-1 text-sm leading-6 font-bold sm:col-span-2 sm:mt-0">
                                {provenanceType}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Details;
