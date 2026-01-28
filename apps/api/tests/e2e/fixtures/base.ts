// SPDX-FileCopyrightText: 2026 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { randNumber } from "@ngneat/falso";
import { test } from "@playwright/test";
import { ApiScope } from "database";
import {
    deleteCurator,
    getOrCreateCurator,
} from "../../../src/helpers/db_queries";
import {
    addRealmRolesToUser,
    createUser,
    deleteUser,
} from "../../../src/helpers/keycloak_queries";
import { getAccessToken } from "../utils/get_access_token";
import {
    seedCreateApiClient,
    seedCreateApiToken,
    seedCreateClearanceGroups,
    seedCreateClearanceGroupWithClearances,
    seedCreateLicenseConclusion,
} from "./seed";

type BaseFixtures = {
    adminUser: {
        id: string;
        username: string;
        token: string;
        curatorId: string;
    };
    regularUser: {
        id: string;
        username: string;
        token: string;
        curatorId: string;
    };
    noGroupsUser: { id: string; username: string; token: string };
    noRolesUser: { id: string; username: string; token: string };
    seed: {
        createClearanceGroups(): ReturnType<typeof seedCreateClearanceGroups>;
        createClearanceGroupWithClearances(): ReturnType<
            typeof seedCreateClearanceGroupWithClearances
        >;
        createLicenseConclusion(
            concludedExpression: string,
            fileSha256: string,
            curatorId: string,
            groupId: number,
        ): ReturnType<typeof seedCreateLicenseConclusion>;
        createApiClient(): ReturnType<typeof seedCreateApiClient>;
        createApiToken(
            apiClientId: string,
            scopes?: ApiScope[],
            clearanceGroupIds?: number[],
            isActive?: boolean,
        ): ReturnType<typeof seedCreateApiToken>;
    };
    registerCleanup: (fn: () => Promise<void>) => void;
};

const password = "password";

export const testBase = test.extend<BaseFixtures>({
    adminUser: async ({}, use) => {
        const username = `admin-${randNumber({ min: 100000, max: 999999 })}`;
        const user = await createUser({
            username: username,
            credentials: [
                {
                    type: "password",
                    value: password,
                    temporary: false,
                },
            ],
            enabled: true,
            firstName: "Admin",
            lastName: "User",
            email: `${username}@example.com`,
        });

        await addRealmRolesToUser(user.id, ["app-admin"]);

        const curatorId = await getOrCreateCurator(user.id, user.username);

        const token = await getAccessToken(user.username, password);

        await use({
            id: user.id,
            username: username,
            token: token,
            curatorId: curatorId,
        });
        await deleteUser(user.id);
        await deleteCurator(curatorId);
    },

    regularUser: async ({}, use) => {
        const username = `user-${randNumber({ min: 100000, max: 999999 })}`;

        const user = await createUser({
            username: username,
            credentials: [
                {
                    type: "password",
                    value: password,
                    temporary: false,
                },
            ],
            enabled: true,
            firstName: "Regular",
            lastName: "User",
            email: `${username}@example.com`,
        });

        await addRealmRolesToUser(user.id, ["app-user"]);

        const curatorId = await getOrCreateCurator(user.id, user.username);

        const token = await getAccessToken(user.username, password);

        await use({
            id: user.id,
            username: username,
            token: token,
            curatorId: curatorId,
        });
        await deleteUser(user.id);
        await deleteCurator(curatorId);
    },

    noGroupsUser: async ({}, use) => {
        const username = `no-groups-user-${randNumber({ min: 100000, max: 999999 })}`;

        const user = await createUser({
            username: username,
            credentials: [
                {
                    type: "password",
                    value: password,
                    temporary: false,
                },
            ],
            enabled: true,
            firstName: "Temporary",
            lastName: "User",
            email: `${username}@example.com`,
        });

        await addRealmRolesToUser(user.id, ["app-read-only-user"]);

        const token = await getAccessToken(user.username, password);

        await use({
            id: user.id,
            username: username,
            token: token,
        });
        await deleteUser(user.id);
    },

    noRolesUser: async ({}, use) => {
        const username = `no-roles-user-${randNumber({ min: 100000, max: 999999 })}`;

        const user = await createUser({
            username: username,
            credentials: [
                {
                    type: "password",
                    value: password,
                    temporary: false,
                },
            ],
            enabled: true,
            firstName: "NoRoles",
            lastName: "User",
            email: `${username}@example.com`,
        });

        const token = await getAccessToken(user.username, password);

        await use({
            id: user.id,
            username: username,
            token: token,
        });
        await deleteUser(user.id);
    },

    seed: async ({ adminUser, regularUser, registerCleanup }, use) => {
        await use({
            async createClearanceGroups() {
                const s = await seedCreateClearanceGroups(
                    adminUser.curatorId,
                    regularUser.curatorId,
                );
                registerCleanup(s.cleanup);
                return s;
            },
            async createClearanceGroupWithClearances() {
                const s = await seedCreateClearanceGroupWithClearances(
                    adminUser.curatorId,
                    regularUser.curatorId,
                );
                registerCleanup(s.cleanup);
                return s;
            },
            async createLicenseConclusion(
                concludedExpression: string,
                fileSha256: string,
                curatorId: string,
                groupId: number,
            ) {
                const lc = await seedCreateLicenseConclusion(
                    concludedExpression,
                    fileSha256,
                    curatorId,
                    groupId,
                );
                registerCleanup(lc.cleanup);
                return lc;
            },
            async createApiClient() {
                const apiClient = await seedCreateApiClient();
                registerCleanup(apiClient.cleanup);
                return apiClient;
            },
            async createApiToken(
                apiClientId: string,
                scopes: ApiScope[] = [ApiScope.SCAN_DATA],
                clearanceGroupIds?: number[],
                isActive?: boolean,
            ) {
                const apiToken = await seedCreateApiToken(
                    apiClientId,
                    scopes,
                    clearanceGroupIds,
                    isActive,
                );
                registerCleanup(apiToken.cleanup);
                return apiToken;
            },
        });
    },

    registerCleanup: async ({}, use) => {
        const cleanups: Array<() => Promise<void>> = [];
        await use((fn) => cleanups.push(fn));

        for (const fn of cleanups.reverse()) {
            try {
                await fn();
            } catch {}
        }
    },
});

export { expect, type APIRequestContext } from "@playwright/test";
