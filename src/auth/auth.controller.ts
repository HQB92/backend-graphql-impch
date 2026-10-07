import { Request, Response } from 'express';
import logger from '../utils/logger';
import { login } from './auth.service';
import { listSectorChurches, loginSector } from './sectorAuth.service';
import { clearFailures, recordFailure, retryAfterSeconds } from './loginLimiter';

const TOO_MANY_ATTEMPTS = 'Demasiados intentos. Intente nuevamente más tarde.';

// Responde 429 y devuelve true si la clave está bloqueada.
const rejectIfBlocked = (key: string, res: Response): boolean => {
    const retryAfter = retryAfterSeconds(key);
    if (retryAfter === 0) return false;
    res.set('Retry-After', String(retryAfter));
    res.status(429).send({ message: TOO_MANY_ATTEMPTS });
    return true;
};

// Misma regla de id que loginSector; un id inutilizable se cuenta por ip.
const sectorKey = (sectorChurchId: unknown, ip: string | undefined): string => {
    const isIdLike = typeof sectorChurchId === 'number' || typeof sectorChurchId === 'string';
    const id = isIdLike ? Number(sectorChurchId) : NaN;
    return Number.isInteger(id) && id > 0 ? `sector:${id}:${ip}` : `sector:invalid:${ip}`;
};

const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const key = `user:${String(username ?? '').toLowerCase().trim()}:${req.ip}`;
    if (rejectIfBlocked(key, res)) return;
    try {
        let token = await login(username, password);
        token = token.replace(/"/g, '');
        clearFailures(key);
        res.send({ token });
    } catch (error: any) {
        recordFailure(key);
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
    const key = sectorKey(sectorChurchId, req.ip);
    if (rejectIfBlocked(key, res)) return;
    try {
        const token = await loginSector(sectorChurchId, password);
        clearFailures(key);
        res.send({ token });
    } catch {
        recordFailure(key);
        // loginSector ya registró el motivo; al cliente siempre el mismo mensaje.
        res.status(401).send({ message: 'Credenciales inválidas' });
    }
};

export { loginController, sectorChurchesController, sectorLoginController };
