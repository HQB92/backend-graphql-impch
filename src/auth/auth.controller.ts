import {Request, Response} from 'express';
import {login} from './auth.service';

export const loginController = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    try {
        let token = await login(username, password);
        token = token.replace(/"/g, '');
        res.send({token});
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).send(error.message);
        } else {
            res.status(500).send('An unknown error occurred');
        }
    }
};

exports = {loginController};