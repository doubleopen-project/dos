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
interface LicenseInfo {
    license: string;
    plus?: true | undefined;
    exception?: string | undefined;
}
interface ConjunctionInfo {
    conjunction: "and" | "or";
    left: LicenseInfo | ConjunctionInfo;
    right: LicenseInfo | ConjunctionInfo;
}

declare const parseSPDX: (source: string) => LicenseInfo | ConjunctionInfo;

export { parseSPDX };
