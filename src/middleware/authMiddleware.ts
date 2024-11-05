import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.sendStatus(401); 
        return; 
    }

    jwt.verify(token, process.env.JWT_SECRET || '', (err) => {
        if (err) {
            res.sendStatus(403); 
            return;
        }
        next();
    });
};
