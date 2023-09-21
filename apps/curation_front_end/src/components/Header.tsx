// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from 'react';
import logo from '@/public/icons/Double_Open_logo.png';

const Header = () => {
    return (
        <div className='flex justify-between px-4 pt-4'>
            <img src={logo.src} alt='DoubleOpen Logo' width='160' />
            <h2>Welcome back, willebra</h2>
        </div>
    );
};

export default Header;
