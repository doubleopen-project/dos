// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

const express = require('express');

const app = express();

app.use('/', (req: Express.Request, res: Express.Response) => {
    
})

app.listen(3000, () =>
  console.log('Server listening on port 3000!'),
);