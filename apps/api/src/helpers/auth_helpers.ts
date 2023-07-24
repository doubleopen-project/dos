// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT
import { NextFunction, Request, Response } from 'express';

export const authenticateORTToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log('Token: ' + token);

    if (token == null) return res.status(401).json({ message: 'Unauthorized' })

    /*
    jwt.verify(token, process.env.ORT_TOKEN as string, (err: any, user: any) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })*/

    if (token === process.env.ORT_TOKEN) {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
}

export const authenticateSAToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ message: 'Unauthorized' })

    console.log('Token: ' + token);
    console.log('SA_TOKEN: ' + process.env.SA_TOKEN);

    if (token === process.env.SA_TOKEN) {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
}