// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        "message": "Hello World"
    });
})

export default router;
