import { Request, Response } from 'express';
import logger from '../utils/logger';
import { login } from './auth.service';
import { listSectorChurches, loginSector } from './sectorAuth.service';
import { clearFailures, reserve } from './loginLimiter';

const TOO_MANY_ATTEMPTS = 'Demasiados intentos. Intente nuevamente más tarde.';

const SECTOR_CREDENTIAL_ERROR = 'Credenciales inválidas';
// Mensajes con que auth.service y tokensLogs rechazan credenciales.
const USER_CREDENTIAL_ERRORS = ['Usuario no encontrado', 'Contraseña inválida'];

const tooManyAttempts = (retryAfter: number, res: Response): void => {
    res.set('Retry-After', String(retryAfter));
    res.status(429).send({ message: TOO_MANY_ATTEMPTS });
};

// Misma regla de id que loginSector; un id inutilizable se cuenta por ip.
const sectorKey = (sectorChurchId: unknown, ip: string | undefined): string => {
    const isIdLike = typeof sectorChurchId === 'number' || typeof sectorChurchId === 'string';
    const id = isIdLike ? Number(sectorChurchId) : NaN;
    return Number.isInteger(id) && id > 0 ? `sector:${id}:${ip}` : `sector:invalid:${ip}`;
};

const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const usable = typeof username === 'string' && username.trim() !== '' && typeof password === 'string';
    const key = usable ? `user:${username.toLowerCase().trim()}:${req.ip}` : `user:invalid:${req.ip}`;
    const attempt = reserve(key);
    if (attempt.blocked) return tooManyAttempts(attempt.retryAfterSeconds, res);
    if (!usable) {
        // Sin llamar al servicio; mismo mensaje que un usuario desconocido.
        res.status(401).send('Usuario no encontrado');
        return;
    }
    try {
        let token = await login(username, password);
        token = token.replace(/"/g, '');
        clearFailures(key);
        res.send({ token });
    } catch (error: any) {
        if (!USER_CREDENTIAL_ERRORS.includes(error?.message)) attempt.release();
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
    const attempt = reserve(key);
    if (attempt.blocked) return tooManyAttempts(attempt.retryAfterSeconds, res);
    try {
        const token = await loginSector(sectorChurchId, password);
        clearFailures(key);
        res.send({ token });
    } catch (error: any) {
        if (error?.message !== SECTOR_CREDENTIAL_ERROR) attempt.release();
        // loginSector ya registró el motivo; al cliente siempre el mismo mensaje.
        res.status(401).send({ message: 'Credenciales inválidas' });
    }
};

export { loginController, sectorChurchesController, sectorLoginController };
