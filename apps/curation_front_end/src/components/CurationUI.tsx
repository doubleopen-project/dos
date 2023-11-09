// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import PackageTree from "@/components/PackageTree";
import CodeInspector from "@/components/CodeInspector";

type CurationUIProps = {
    purl: string | undefined;
    path: string | undefined;
};

const CurationUI = ({ purl, path }: CurationUIProps) => {
    return (
        <div className="flex flex-col md:flex-row md:h-screen overflow-auto">
            {/* 1st column: Show and filter package */}
            <div className="flex flex-col m-2 mr-1 p-2 rounded-md border shadow-lg overflow-auto resize-x">
                <PackageTree purl={purl} />
            </div>

            {/* 2nd column: Open a file for license inspection and curation */}
            <div className="flex-1 m-2 ml-1 p-2 rounded-md border shadow-lg overflow-auto">
                <CodeInspector purl={purl} path={path} />
            </div>
        </div>
    );
};

export default CurationUI;
