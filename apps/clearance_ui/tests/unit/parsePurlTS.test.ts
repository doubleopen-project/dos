// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Unit tests for parsePurlAndQualifiers helper function

import { assert } from "chai";
import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

describe("parsePurlAndQualifiers tests", () => {
    it("should decode the qualifiers of a RepositoryProvenance", function () {
        const purl =
            "pkg:npm/%40floating-ui/core@1.5.2?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Ffloating-ui%2Ffloating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636#packages/core";
        const parsedPurl = parsePurlAndQualifiers(purl);

        assert.strictEqual(parsedPurl.qualifiers?.vcs_type, "Git");
        assert.strictEqual(
            parsedPurl.qualifiers?.vcs_url,
            "https://github.com/floating-ui/floating-ui.git",
        );
        assert.strictEqual(
            parsedPurl.qualifiers?.vcs_revision,
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
        assert.strictEqual(
            parsedPurl.qualifiers?.resolved_revision,
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
    });

    it("should decode the qualifiers of an ArtifactProvenance", function () {
        const purl =
            "pkg:npm/%40radix-ui/react-context@1.0.0?download_url=https%3A%2F%2Fregistry.npmjs.org%2F%40radix-ui%2Freact-context%2F-%2Freact-context-1.0.0.tgz&checksum=sha1%3Af38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0";
        const parsedPurl = parsePurlAndQualifiers(purl);

        assert.strictEqual(
            parsedPurl.qualifiers?.download_url,
            "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.0.0.tgz",
        );
        assert.strictEqual(
            parsedPurl.qualifiers?.checksum,
            "sha1:f38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0",
        );
    });

    it("should decode a RepositoryProvenance PURL into all of its components, including qualifiers", function () {
        const purl =
            "pkg:npm/%40floating-ui/core@1.5.2?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Ffloating-ui%2Ffloating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636#packages/core";
        const parsedPurl = parsePurlAndQualifiers(purl);

        assert.strictEqual(parsedPurl.type, "npm");
        assert.strictEqual(parsedPurl.namespace, "@floating-ui");
        assert.strictEqual(parsedPurl.name, "core");
        assert.strictEqual(parsedPurl.version, "1.5.2");
        assert.strictEqual(parsedPurl.subpath, "packages/core");
        assert.strictEqual(parsedPurl.qualifiers?.vcs_type, "Git");
        assert.strictEqual(
            parsedPurl.qualifiers?.vcs_url,
            "https://github.com/floating-ui/floating-ui.git",
        );
        assert.strictEqual(
            parsedPurl.qualifiers?.vcs_revision,
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
        assert.strictEqual(
            parsedPurl.qualifiers?.resolved_revision,
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
    });

    it("should decode an ArtifactProvenance PURL into all of its components, including qualifiers", function () {
        const purl =
            "pkg:npm/%40radix-ui/react-context@1.0.0?download_url=https%3A%2F%2Fregistry.npmjs.org%2F%40radix-ui%2Freact-context%2F-%2Freact-context-1.0.0.tgz&checksum=sha1%3Af38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0";
        const parsedPurl = parsePurlAndQualifiers(purl);

        assert.strictEqual(parsedPurl.type, "npm");
        assert.strictEqual(parsedPurl.namespace, "@radix-ui");
        assert.strictEqual(parsedPurl.name, "react-context");
        assert.strictEqual(parsedPurl.version, "1.0.0");
        assert.strictEqual(parsedPurl.subpath, null);
        assert.strictEqual(
            parsedPurl.qualifiers?.download_url,
            "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.0.0.tgz",
        );
        assert.strictEqual(
            parsedPurl.qualifiers?.checksum,
            "sha1:f38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0",
        );
    });
});
