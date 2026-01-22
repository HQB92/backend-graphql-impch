import jwt from 'jsonwebtoken';
import 'dotenv/config';

export interface TokenPayload {
    userId: number;
    username: string;
    email: string;
    rut: string;
    roles: string[];
    exp?: number;
}

export const generateToken = (userId: number, username: string, email: string, rut: string, roles: string[]): string => {
    return jwt.sign({ userId, username, email, rut, roles }, process.env.SECRET_KEY as string, { expiresIn: '3h' });
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            console.error('[Auth] SECRET_KEY is not set in environment variables');
            throw new Error('Server configuration error: SECRET_KEY missing');
        }
        
        const decoded = jwt.verify(token, secretKey) as TokenPayload;
        return decoded;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            console.error('[Auth] Token expired:', error.expiredAt);
            throw new Error('Token expired');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('[Auth] Invalid token:', error.message);
            throw new Error('Invalid token');
        } else if (error.name === 'NotBeforeError') {
            console.error('[Auth] Token not active yet:', error.date);
            throw new Error('Token not active');
        }
        console.error('[Auth] Token verification error:', error.message || error);
        throw new Error('Invalid/Expired token');
    }
};
