// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { assert } from "chai";
import { extractStringFromGlob } from "../../src/helpers/globHelpers";
import { replaceANDExceptionWithANDPrefixException } from "../../src/helpers/license_expression_helpers";
import { parsePurl } from "../../src/helpers/purl_helpers";

export default function suite(): void {
    describe("Testing purl helpers", function () {
        it("should decode a RepositoryProvenance PURL into its main components", function () {
            const purl =
                "pkg:npm/%40floating-ui/core@1.5.2?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Ffloating-ui%2Ffloating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636#packages/core";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "npm");
            assert.strictEqual(parsedPurl.namespace, "@floating-ui");
            assert.strictEqual(parsedPurl.name, "core");
            assert.strictEqual(parsedPurl.version, "1.5.2");
            assert.strictEqual(
                parsedPurl.qualifiers,
                "vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Ffloating-ui%2Ffloating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636",
            );
            assert.strictEqual(parsedPurl.subpath, "packages/core");
        });

        it("should decode an ArtifactProvenance PURL into its main components", function () {
            const purl =
                "pkg:npm/%40radix-ui/react-context@1.0.0?download_url=https%3A%2F%2Fregistry.npmjs.org%2F%40radix-ui%2Freact-context%2F-%2Freact-context-1.0.0.tgz&checksum=sha1%3Af38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "npm");
            assert.strictEqual(parsedPurl.namespace, "@radix-ui");
            assert.strictEqual(parsedPurl.name, "react-context");
            assert.strictEqual(parsedPurl.version, "1.0.0");
            assert.strictEqual(
                parsedPurl.qualifiers,
                "download_url=https%3A%2F%2Fregistry.npmjs.org%2F%40radix-ui%2Freact-context%2F-%2Freact-context-1.0.0.tgz&checksum=sha1%3Af38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0",
            );
            assert.strictEqual(parsedPurl.subpath, null);
        });

        it("should uri encode all qualifier values", function () {
            const purl =
                "pkg:maven/commons-beanutils/commons-beanutils@1.9.4?vcs_type=Subversion&vcs_url=http%3A%2F%2Fsvn.apache.org%2Frepos%2Fasf%2Fcommons%2Fproper%2Fbeanutils&vcs_revision=tags%2FBEANUTILS_1_9_3_RC3&resolved_revision=603598";
            const parsedPurl = parsePurl(purl);

            assert.strictEqual(parsedPurl.type, "maven");
            assert.strictEqual(parsedPurl.namespace, "commons-beanutils");
            assert.strictEqual(parsedPurl.name, "commons-beanutils");
            assert.strictEqual(parsedPurl.version, "1.9.4");
            assert.strictEqual(
                parsedPurl.qualifiers,
                "vcs_type=Subversion&vcs_url=http%3A%2F%2Fsvn.apache.org%2Frepos%2Fasf%2Fcommons%2Fproper%2Fbeanutils&vcs_revision=tags%2FBEANUTILS_1_9_3_RC3&resolved_revision=603598",
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

    describe("Testing license expression helpers", function () {
        it("should replace AND <exception> with AND LicenseRef-dos-<exception>", function () {
            const expression =
                "CDDL-1.1 AND GPL-2.0-only AND Classpath-exception-2.0";
            const expectedExpression =
                "CDDL-1.1 AND GPL-2.0-only AND LicenseRef-dos-Classpath-exception-2.0";

            const result =
                replaceANDExceptionWithANDPrefixException(expression);
            assert.strictEqual(result, expectedExpression);
        });

        it("should not replace AND <exception> with AND LicenseRef-dos-<exception> if exception starts with LicenseRef", function () {
            const expression =
                "GPL-2.0-or-later AND LicenseRef-scancode-generic-exception";

            const result =
                replaceANDExceptionWithANDPrefixException(expression);
            assert.strictEqual(result, expression);
        });

        it("should replace `) AND <exception>` with `) AND LicenseRef-dos-<exception>`", function () {
            const expression =
                "BSD-3-Clause AND (GPL-3.0-only AND GCC-exception-3.1 AND GPL-3.0-or-later AND GCC-exception-3.1) AND GCC-exception-3.1";
            const expectedExpression =
                "BSD-3-Clause AND (GPL-3.0-only AND LicenseRef-dos-GCC-exception-3.1 AND GPL-3.0-or-later AND LicenseRef-dos-GCC-exception-3.1) AND LicenseRef-dos-GCC-exception-3.1";

            const result =
                replaceANDExceptionWithANDPrefixException(expression);
            assert.strictEqual(result, expectedExpression);
        });
    });

    describe("Testing glob helpers", function () {
        it("should extract a string from a glob with a non-magic parent path and a magic child path", function () {
            const glob = "src/**/*.ts";
            const result = extractStringFromGlob(glob);
            assert.strictEqual(result, "src");
        });

        it("should extract a string from a glob with a magic parent path and a non-magic child path", function () {
            const glob = "**/index.ts";
            const result = extractStringFromGlob(glob);
            assert.strictEqual(result, "index.ts");
        });

        it("should extract a string when used with a glob with a magic parent path and a magic child path, containing an extension", function () {
            const glob = "**/*.ts";
            const result = extractStringFromGlob(glob);
            assert.strictEqual(result, ".ts");
        });

        it("should extract a string from a glob with a magic parent path and a magic child path, with a non-magic part in the middle", function () {
            const glob = "**/src/**/*.ts";
            const result = extractStringFromGlob(glob);
            assert.strictEqual(result, "src");
        });

        it("should return undefined when used with a glob with a magic parent path and a magic child path, without an extension", function () {
            const glob = "**/*";
            const result = extractStringFromGlob(glob);
            assert.strictEqual(result, undefined);
        });

        it("should return undefined when used with a glob with a list of files/globs inside curly braces", function () {
            const glob = "{doc/source/dev/**,HACKING.rst.txt}";
            const result = extractStringFromGlob(glob);
            assert.strictEqual(result, undefined);
        });
    });
}
