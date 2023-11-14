// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { useUser } from "@/hooks/useUser";
import logo from "@/public/icons/Double_Open_logo.png";
import Image from "next/image";
import React from "react";

const Header = () => {
    const user = useUser({});
    const username = user ? user.username : user === null ? "Guest" : undefined;
    return (
        <div className="flex justify-between p-4">
            <Image src={logo} alt="DoubleOpen Logo" width="160" />
            {username && <h2>Welcome back, {username}</h2>}
        </div>
    );
};

export default Header;
