// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { assert } from "chai";
import { parsePurl } from "../../src/helpers/purl_helpers";
import { parseResult } from "../../src/helpers/result_parser";

export default function suite(): void {
    describe("Testing purl helpers", function () {
        it("should decode a RepositoryProvenance PURL into its main components", function () {
            const purl =
                "pkg:npm/%40floating-ui/core@1.5.2?vcs_type=Git&vcs_url=https://github.com/floating-ui/floating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636#packages/core";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "npm");
            assert.strictEqual(parsedPurl.namespace, "@floating-ui");
            assert.strictEqual(parsedPurl.name, "core");
            assert.strictEqual(parsedPurl.version, "1.5.2");
            assert.strictEqual(
                parsedPurl.qualifiers,
                "vcs_type=Git&vcs_url=https://github.com/floating-ui/floating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636",
            );
            assert.strictEqual(parsedPurl.subpath, "packages/core");
        });

        it("should decode an ArtifactProvenance PURL into its main components", function () {
            const purl =
                "pkg:npm/%40radix-ui/react-context@1.0.0?download_url=https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.0.0.tgz&checksum=sha1:f38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "npm");
            assert.strictEqual(parsedPurl.namespace, "@radix-ui");
            assert.strictEqual(parsedPurl.name, "react-context");
            assert.strictEqual(parsedPurl.version, "1.0.0");
            assert.strictEqual(
                parsedPurl.qualifiers,
                "download_url=https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.0.0.tgz&checksum=sha1:f38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0",
            );
            assert.strictEqual(parsedPurl.subpath, null);
        });

        it("should uri encode all qualifier values", function () {
            const purl =
                "pkg:maven/commons-beanutils/commons-beanutils@1.9.4?vcs_type=Subversion&vcs_url=http://svn.apache.org/repos/asf/commons/proper/beanutils&vcs_revision=tags/BEANUTILS_1_9_3_RC3&resolved_revision=603598";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "maven");
            assert.strictEqual(parsedPurl.namespace, "commons-beanutils");
            assert.strictEqual(parsedPurl.name, "commons-beanutils");
            assert.strictEqual(parsedPurl.version, "1.9.4");
            assert.strictEqual(
                parsedPurl.qualifiers,
                "vcs_type=Subversion&vcs_url=http://svn.apache.org/repos/asf/commons/proper/beanutils&vcs_revision=tags/BEANUTILS_1_9_3_RC3&resolved_revision=603598",
            );
            assert.strictEqual(parsedPurl.subpath, null);
        });

        it("should decode a PackageURL without qualifiers into its main components", function () {
            const purl = "pkg:npm/%40floating-ui/core@1.5.2";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "npm");
            assert.strictEqual(parsedPurl.namespace, "@floating-ui");
            assert.strictEqual(parsedPurl.name, "core");
            assert.strictEqual(parsedPurl.version, "1.5.2");
            assert.strictEqual(parsedPurl.qualifiers, undefined);
            assert.strictEqual(parsedPurl.subpath, null);
        });
    });

    describe("Testing result parser", function () {
        it("should parse a JSON string and nested JSON string to JSON object", function () {
            const result = `{
                "key": "value",
                "nested": "{\\"key\\": \\"value\\"}"
            }`;
            const parsedResult = parseResult(result);

            assert.strictEqual(parsedResult.key, "value");
            assert.strictEqual(parsedResult.nested.key, "value");
        });
    });
}
