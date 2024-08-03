import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (userId:number, username:string, email:string, rut:string, roles:[string]) => {
    return jwt.sign({ userId, username, email, rut, roles }, process.env.SECRET_KEY || '', { expiresIn: '3h' });
};

const verifyToken = (token:string) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY || '');
    } catch (error) {
        throw new Error('Invalid/Expired token');
    }
};

export { generateToken, verifyToken };
