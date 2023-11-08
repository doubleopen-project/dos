// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from "react";
import logo from "@/public/icons/Double_Open_logo.png";
import { useUser } from "@/hooks/useUser";

const Header = () => {
    const user = useUser({});
    const username = user ? user.username : user === null ? "Guest" : undefined;
    return (
        <div className="flex justify-between p-4">
            <img src={logo.src} alt="DoubleOpen Logo" width="160" />
            {username && <h2>Welcome back, {username}</h2>}
        </div>
    );
};

export default Header;
