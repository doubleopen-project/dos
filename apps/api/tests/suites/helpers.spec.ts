// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

import { assert } from "chai";
import { replaceANDExceptionWithWITHException } from "../../src/helpers/license_expression_helpers";
import { parsePurl } from "../../src/helpers/purl_helpers";

export default function suite(): void {
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

    it("should replace AND exception with WITH exception", function () {
        const expression =
            "AFL-2.1 AND ANTLR-PD AND APSL-1.0 AND APSL-2.0 AND Apache-1.1 AND Apache-2.0 AND (Apache-2.0 AND Artistic-1.0 AND Artistic-1.0-Perl) AND BSD-2-Clause AND BSD-2-Clause-Views AND BSD-3-Clause AND BSD-4-Clause AND BSD-4-Clause-UC AND BSL-1.0 AND (CC-BY-2.5 AND CC-BY-3.0) AND (CC-BY-4.0 AND CC-BY-SA-3.0 AND CC-BY-SA-4.0) AND CDDL-1.0 AND CDDL-1.1 AND CPL-1.0 AND Classpath-exception-2.0 AND EPL-1.0 AND EPL-2.0 AND (FSFAP AND GPL-1.0-only) AND GPL-1.0-or-later AND GPL-2.0-only AND (GPL-2.0-only AND Classpath-exception-2.0) AND (GPL-2.0-or-later AND Classpath-exception-2.0 AND GPL-3.0-only) AND HPND AND ICU AND IJG AND ISC AND (JSON AND LGPL-2.0-only) AND LGPL-2.0-or-later AND LGPL-2.1-only AND LGPL-2.1-or-later AND LGPL-3.0-only AND LGPL-3.0-or-later AND LPPL-1.3c AND Libpng AND Autoconf-exception-generic AND Bitstream-Vera AND LicenseRef-scancode-bsd-3-clause-no-change AND LicenseRef-scancode-bsd-simplified-darwin AND LicenseRef-scancode-freemarker AND LicenseRef-scancode-ietf AND LicenseRef-scancode-ietf-trust AND LicenseRef-scancode-iptc-2006 AND (LicenseRef-scancode-iso-8879 AND LicenseRef-scancode-jetty-ccla-1.1) AND (LicenseRef-scancode-mit-nagy AND LicenseRef-scancode-mit-old-style) AND (LicenseRef-scancode-mx4j AND LicenseRef-scancode-oasis-ws-security-spec AND LicenseRef-scancode-ogc) AND LicenseRef-scancode-protobuf AND (LicenseRef-scancode-red-hat-attribution AND LicenseRef-scancode-rsa-md4) AND (snprintf AND LicenseRef-scancode-sun-sdk-spec-1.1) AND SunPro AND LicenseRef-scancode-ubuntu-font-1.0 AND LicenseRef-scancode-unicode AND LicenseRef-scancode-unicode-mappings AND LicenseRef-scancode-ws-addressing-spec AND LicenseRef-scancode-ws-trust-specification AND LicenseRef-scancode-x11-lucent AND MIT AND (MIT-open-group AND MPL-1.0) AND (MPL-1.1 AND MPL-2.0) AND MS-PL AND NCSA AND NPL-1.1 AND (NTP AND Noweb) AND (OFL-1.1 AND OLDAP-2.8) AND (OpenSSL AND Python-2.0) AND (Ruby AND Unicode-DFS-2016) AND W3C AND W3C-19980720 AND X11 AND Zlib AND bzip2-1.0.6 AND curl";
        const expectedExpression =
            "AFL-2.1 AND ANTLR-PD AND APSL-1.0 AND APSL-2.0 AND Apache-1.1 AND Apache-2.0 AND (Apache-2.0 AND Artistic-1.0 AND Artistic-1.0-Perl) AND BSD-2-Clause AND BSD-2-Clause-Views AND BSD-3-Clause AND BSD-4-Clause AND BSD-4-Clause-UC AND BSL-1.0 AND (CC-BY-2.5 AND CC-BY-3.0) AND (CC-BY-4.0 AND CC-BY-SA-3.0 AND CC-BY-SA-4.0) AND CDDL-1.0 AND CDDL-1.1 AND CPL-1.0 WITH Classpath-exception-2.0 AND EPL-1.0 AND EPL-2.0 AND (FSFAP AND GPL-1.0-only) AND GPL-1.0-or-later AND GPL-2.0-only AND (GPL-2.0-only WITH Classpath-exception-2.0) AND (GPL-2.0-or-later WITH Classpath-exception-2.0 AND GPL-3.0-only) AND HPND AND ICU AND IJG AND ISC AND (JSON AND LGPL-2.0-only) AND LGPL-2.0-or-later AND LGPL-2.1-only AND LGPL-2.1-or-later AND LGPL-3.0-only AND LGPL-3.0-or-later AND LPPL-1.3c AND Libpng WITH Autoconf-exception-generic AND Bitstream-Vera AND LicenseRef-scancode-bsd-3-clause-no-change AND LicenseRef-scancode-bsd-simplified-darwin AND LicenseRef-scancode-freemarker AND LicenseRef-scancode-ietf AND LicenseRef-scancode-ietf-trust AND LicenseRef-scancode-iptc-2006 AND (LicenseRef-scancode-iso-8879 AND LicenseRef-scancode-jetty-ccla-1.1) AND (LicenseRef-scancode-mit-nagy AND LicenseRef-scancode-mit-old-style) AND (LicenseRef-scancode-mx4j AND LicenseRef-scancode-oasis-ws-security-spec AND LicenseRef-scancode-ogc) AND LicenseRef-scancode-protobuf AND (LicenseRef-scancode-red-hat-attribution AND LicenseRef-scancode-rsa-md4) AND (snprintf AND LicenseRef-scancode-sun-sdk-spec-1.1) AND SunPro AND LicenseRef-scancode-ubuntu-font-1.0 AND LicenseRef-scancode-unicode AND LicenseRef-scancode-unicode-mappings AND LicenseRef-scancode-ws-addressing-spec AND LicenseRef-scancode-ws-trust-specification AND LicenseRef-scancode-x11-lucent AND MIT AND (MIT-open-group AND MPL-1.0) AND (MPL-1.1 AND MPL-2.0) AND MS-PL AND NCSA AND NPL-1.1 AND (NTP AND Noweb) AND (OFL-1.1 AND OLDAP-2.8) AND (OpenSSL AND Python-2.0) AND (Ruby AND Unicode-DFS-2016) AND W3C AND W3C-19980720 AND X11 AND Zlib AND bzip2-1.0.6 AND curl";

        const result = replaceANDExceptionWithWITHException(expression);

        assert.strictEqual(result, expectedExpression);
    });
}
