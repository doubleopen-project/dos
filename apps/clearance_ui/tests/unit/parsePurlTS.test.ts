// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

// Unit tests for parsePurlAndQualifiers helper function

import { parsePurlAndQualifiers } from "@/helpers/parsePurlAndQualifiers";

describe("parsePurlAndQualifiers tests", () => {
    it("should decode the qualifiers of a RepositoryProvenance", function () {
        const purl =
            "pkg:npm/%40floating-ui/core@1.5.2?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Ffloating-ui%2Ffloating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636#packages/core";
        const parsedPurl = parsePurlAndQualifiers(purl);

        expect(parsedPurl.qualifiers?.vcs_type).toBe("Git");
        expect(parsedPurl.qualifiers?.vcs_url).toBe(
            "https://github.com/floating-ui/floating-ui.git",
        );
        expect(parsedPurl.qualifiers?.vcs_revision).toBe(
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
        expect(parsedPurl.qualifiers?.resolved_revision).toBe(
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
    });

    it("should decode the qualifiers of an ArtifactProvenance", function () {
        const purl =
            "pkg:npm/%40radix-ui/react-context@1.0.0?download_url=https%3A%2F%2Fregistry.npmjs.org%2F%40radix-ui%2Freact-context%2F-%2Freact-context-1.0.0.tgz&checksum=sha1%3Af38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0";
        const parsedPurl = parsePurlAndQualifiers(purl);

        expect(parsedPurl.qualifiers?.download_url).toBe(
            "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.0.0.tgz",
        );
        expect(parsedPurl.qualifiers?.checksum).toBe(
            "sha1:f38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0",
        );
    });

    it("should decode a RepositoryProvenance PURL into all of its components, including qualifiers", function () {
        const purl =
            "pkg:npm/%40floating-ui/core@1.5.2?vcs_type=Git&vcs_url=https%3A%2F%2Fgithub.com%2Ffloating-ui%2Ffloating-ui.git&vcs_revision=78e8d87ec2fd2172921937e24390806d7dedb636&resolved_revision=78e8d87ec2fd2172921937e24390806d7dedb636#packages/core";
        const parsedPurl = parsePurlAndQualifiers(purl);

        expect(parsedPurl.type).toBe("npm");
        expect(parsedPurl.namespace).toBe("@floating-ui");
        expect(parsedPurl.name).toBe("core");
        expect(parsedPurl.version).toBe("1.5.2");
        expect(parsedPurl.subpath).toBe("packages/core");
        expect(parsedPurl.qualifiers?.vcs_type).toBe("Git");
        expect(parsedPurl.qualifiers?.vcs_url).toBe(
            "https://github.com/floating-ui/floating-ui.git",
        );
        expect(parsedPurl.qualifiers?.vcs_revision).toBe(
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
        expect(parsedPurl.qualifiers?.resolved_revision).toBe(
            "78e8d87ec2fd2172921937e24390806d7dedb636",
        );
    });

    it("should decode an ArtifactProvenance PURL into all of its components, including qualifiers", function () {
        const purl =
            "pkg:npm/%40radix-ui/react-context@1.0.0?download_url=https%3A%2F%2Fregistry.npmjs.org%2F%40radix-ui%2Freact-context%2F-%2Freact-context-1.0.0.tgz&checksum=sha1%3Af38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0";
        const parsedPurl = parsePurlAndQualifiers(purl);

        expect(parsedPurl.type).toBe("npm");
        expect(parsedPurl.namespace).toBe("@radix-ui");
        expect(parsedPurl.name).toBe("react-context");
        expect(parsedPurl.version).toBe("1.0.0");
        expect(parsedPurl.subpath).toBe(undefined);
        expect(parsedPurl.qualifiers?.download_url).toBe(
            "https://registry.npmjs.org/@radix-ui/react-context/-/react-context-1.0.0.tgz",
        );
        expect(parsedPurl.qualifiers?.checksum).toBe(
            "sha1:f38e30c5859a9fb5e9aa9a9da452ee3ed9e0aee0",
        );
    });
});
