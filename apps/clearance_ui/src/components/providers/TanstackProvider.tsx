// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useState } from "react";
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isAxiosError } from "axios";
import { signIn } from "next-auth/react";
import { getAccessToken } from "@/lib/authTokenManager";

const TanstackProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: async (error) => {
                        if (
                            isAxiosError(error) &&
                            error.response?.status === 401
                        ) {
                            /*
                             * Check if the session is not valid anymore by
                             * attempting to call the userinfo endpoint.
                             * This extra check should help mitigate possible
                             * network issues that could be causing a temporary
                             * 401 error.
                             */

                            const response = await fetch("/api/auth/userinfo", {
                                headers: {
                                    Authorization: `Bearer ${getAccessToken()}`,
                                },
                            });

                            if (response.status === 401) {
                                // Redirect to login page
                                signIn("keycloak", {
                                    callbackUrl: window.location.href,
                                });
                            }
                        }
                    },
                }),
            }),
    );
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default TanstackProvider;
