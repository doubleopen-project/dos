/*
 * Parser is based on spdx-expression-parse.js <https://github.com/jslicense/spdx-expression-parse.js>, which is licensed under MIT and includes the following copyright holders:
 * SPDX-FileCopyrightText: 2015 Kyle E. Mitchell <kyle@kemitchell.com> (https://kemitchell.com)
 * SPDX-FileCopyrightText: 2015 C. Scott Ananian <cscott@cscott.net> (http://cscott.net)
 * SPDX-FileCopyrightText: 2015 Shinnosuke Watanabe <snnskwtnb@gmail.com>
 * SPDX-FileCopyrightText: 2015 Antoine Motet <antoine.motet@gmail.com>
 *
 *
 * SPDX-FileCopyrightText: 2024 Double Open Oy <support@doubleopen.org>
 *
 * SPDX-License-Identifier: MIT
 */

var assert = require("assert");
var p = require("./");

// The spec is unclear about tabs and newlines
it("forbids tabs and newlines", function () {
    assert.throws(function () {
        p("MIT\t");
    });
    assert.throws(function () {
        p("\nMIT");
    });
});

it("allows many spaces", function () {
    assert.deepStrictEqual(p(" MIT"), { license: "MIT" });

    assert.deepStrictEqual(p("MIT "), { license: "MIT" });

    assert.deepStrictEqual(p("MIT  AND    BSD-3-Clause"), {
        left: { license: "MIT" },
        conjunction: "and",
        right: { license: "BSD-3-Clause" },
    });
});

it("forbids spaces between a license-id and a following `+`", function () {
    assert.throws(function () {
        p("MIT +");
    }, /Space before `\+`/);
});

it("parses DocumentRefs and LicenseRefs", function () {
    assert.deepStrictEqual(p("LicenseRef-something"), {
        license: "LicenseRef-something",
    });

    assert.deepStrictEqual(
        p("DocumentRef-spdx-tool-1.2 : LicenseRef-MIT-Style-2"),
        { license: "DocumentRef-spdx-tool-1.2:LicenseRef-MIT-Style-2" },
    );
});

// See the note in `parser.js`.
it("parses `AND`, `OR` and `WITH` with the correct precedence", function () {
    assert.deepStrictEqual(p("MIT AND BSD-3-Clause AND CC-BY-4.0"), {
        left: { license: "MIT" },
        conjunction: "and",
        right: {
            left: { license: "BSD-3-Clause" },
            conjunction: "and",
            right: { license: "CC-BY-4.0" },
        },
    });

    assert.deepStrictEqual(
        p(
            "MIT AND BSD-3-Clause WITH GCC-exception-3.1 OR CC-BY-4.0 AND Apache-2.0",
        ),
        {
            left: {
                left: { license: "MIT" },
                conjunction: "and",
                right: {
                    license: "BSD-3-Clause",
                    exception: "GCC-exception-3.1",
                },
            },
            conjunction: "or",
            right: {
                left: { license: "CC-BY-4.0" },
                conjunction: "and",
                right: { license: "Apache-2.0" },
            },
        },
    );
});

it("allows mixed-case `and`, `or`, and `with`", function () {
    var variants = [
        "MIT and BSD-3-Clause or GPL-2.0-only with GCC-exception-2.0",
        "MIT aNd BSD-3-Clause oR GPL-2.0-only wITh GCC-exception-2.0",
        "MIT AnD BSD-3-Clause Or GPL-2.0-only WitH GCC-exception-2.0",
    ];
    var result = {
        left: {
            left: { license: "MIT" },
            conjunction: "and",
            right: { license: "BSD-3-Clause" },
        },
        conjunction: "or",
        right: {
            license: "GPL-2.0-only",
            exception: "GCC-exception-2.0",
        },
    };
    for (let index = 0; index < variants.length; index++) {
        const variant = variants[index];
        assert.deepStrictEqual(p(variant), result);
    }
});

function it(message, test) {
    test();
}
