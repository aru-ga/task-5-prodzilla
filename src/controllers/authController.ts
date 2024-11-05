import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret'; 

export const login = (req: Request, res: Response): void => {
    const { username, password } = req.body;
    const hardcodedUsername = 'admin'; 
    const hardcodedPassword = 'password';

    if (username === hardcodedUsername && password === hardcodedPassword) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
