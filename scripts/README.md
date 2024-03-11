<!--
SPDX-FileCopyrightText: 2024 Double Open

SPDX-License-Identifier: MIT
-->

# Update license colors

This offline script can be used to fetch the license classifications file
and calculate RGB license colouring array based on the license ids. The
ids are normalized ie. ".", "-" and a whitespace are replaced with "\_".

Usage:

    ```shell
    $ npx tsx ./updateLicenseColors.ts
    ```

The resulting array `licenseColors` needs to be copied pasted as the contents of
a similarly named array in `apps/clearance_ui/licenseColors.ts`.
