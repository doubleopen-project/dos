// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT
import { NextFunction, Request, Response } from 'express';
import { findUser } from './db_queries'

export const authenticateORTToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ message: 'Unauthorized' })

    if (token === process.env.ORT_TOKEN || await findUser(token)) next();
    else return res.status(403).json({ message: 'Forbidden' });
}

export const authenticateSAToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Unauthorized' })

    if (token === process.env.SA_TOKEN) next();
    else return res.status(403).json({ message: 'Forbidden' });
}

export const authenticateAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Unauthorized' })
    
    const user = await findUser(token);
    if (token === process.env.ADMIN_TOKEN || (user && user.role === 'ADMIN')) next();
    else return res.status(403).json({ message: 'Forbidden' });
}

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (user && user.role === 'ADMIN') next();
    else return res.status(403).json({ message: 'Forbidden' });
}

export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    
    if (user) next();
    else return res.status(403).json({ message: 'Forbidden' });
}