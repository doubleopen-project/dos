// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
    tab:
        | "inspect"
        | "license_conclusions"
        | "bulk_curations"
        | "path_exclusions";
};

const ClearanceToolbar = ({ tab }: Props) => {
    return (
        <Tabs defaultValue={tab} className="mt-2">
            <TabsList>
                <TabsTrigger value="inspect">Inspect</TabsTrigger>
                <TabsTrigger value="license_conclusions">
                    License Conclusions
                </TabsTrigger>
                <TabsTrigger value="bulk_curations">
                    Bulk Conclusions
                </TabsTrigger>
                <TabsTrigger value="path_exclusions">
                    Path Exclusions
                </TabsTrigger>
            </TabsList>

            <TabsContent value="inspect"></TabsContent>
            <TabsContent value="license_conclusions"></TabsContent>
            <TabsContent value="bulk_curations"></TabsContent>
            <TabsContent value="path_exclusions"></TabsContent>
        </Tabs>
    );
};

export default ClearanceToolbar;
