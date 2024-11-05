// tests/controllers/authController.test.ts
import { login } from '../../src/controllers/authController';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');  

describe('login Controller', () => {
    const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

    it('should return 200 and a token for valid credentials', () => {
        const req = {
            body: { username: 'admin', password: 'password' }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

        login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Login successful',
            token: 'mocked_token'
        });

        expect(jwt.sign).toHaveBeenCalledWith(
            { username: 'admin' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
    });

    it('should return 401 for invalid credentials', () => {
        const req = {
            body: { username: 'wrong_user', password: 'wrong_password' }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
});
