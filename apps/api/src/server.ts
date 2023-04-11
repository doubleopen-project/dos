// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import express from 'express';

const app = express();

app.use('/', (req, res) => {
    res.status(200).json({
      "message": "Hello World"
    });
})

app.listen(5000, () =>
  console.log('Server listening on port 5000!'),
);