import { Request, Response } from 'express';
import logger from '../utils/logger';
import { login } from './auth.service';
import { listSectorChurches, loginSector } from './sectorAuth.service';

const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        let token = await login(username, password);
        token = token.replace(/"/g, '');
        res.send({ token });
    } catch (error: any) {
        logger.logError("Auth - Login", error.message);
        res.status(401).send(error.message);
    }
};

const sectorChurchesController = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.send(await listSectorChurches());
    } catch (error: any) {
        logger.logError("Auth - SectorChurches", error.message);
        res.status(500).send({ message: 'No se pudo cargar la lista de iglesias' });
    }
};

const sectorLoginController = async (req: Request, res: Response): Promise<void> => {
    const { sectorChurchId, password } = req.body ?? {};
    try {
        const token = await loginSector(sectorChurchId, password);
        res.send({ token });
    } catch {
        // loginSector ya registró el motivo; al cliente siempre el mismo mensaje.
        res.status(401).send({ message: 'Credenciales inválidas' });
    }
};

export { loginController, sectorChurchesController, sectorLoginController };
