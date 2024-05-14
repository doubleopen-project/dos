// SPDX-FileCopyrightText: 2024 Double Open Oy
//
// SPDX-License-Identifier: MIT

export default function Custom403() {
    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-red-500">
                Unauthorized. You are not allowed to access the requested page.
            </p>
        </div>
    );
}
