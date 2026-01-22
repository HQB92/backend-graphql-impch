import { Request, Response } from 'express';
import logger from '../utils/logger';
import { login } from './auth.service';

const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        console.log("LoginController");
        console.log(req.body);
        let token = await login(username, password);
        token = token.replace(/"/g, '');
        res.send({ token });
    } catch (error: any) {
        logger.logError("Auth - Login", error.message);
        res.status(401).send(error.message);
    }
};

export { loginController };
