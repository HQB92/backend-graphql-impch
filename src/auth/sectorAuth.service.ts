import bcrypt from 'bcryptjs';
import SectorChurch from '../db/models/sectorChurch.model';
import { generateSectorToken } from '../utils/auth';
import logger from '../utils/logger';
import { errorMessage } from '../services/sector.util';

const INVALID_CREDENTIALS = 'Credenciales inválidas';

// Se compara contra este hash cuando la iglesia no existe, para que la
// respuesta tarde lo mismo que con una clave incorrecta.
const DUMMY_HASH = bcrypt.hashSync('sin-iglesia', 10);

const listSectorChurches = async (): Promise<{ id: number; name: string }[]> => {
    const churches = await SectorChurch.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    });
    return churches.map((church) => ({ id: church.id, name: church.name }));
};

const loginSector = async (sectorChurchId: unknown, password: unknown): Promise<string> => {
    const operation = 'Auth - SectorLogin';
    logger.logStart(operation);

    try {
        const isIdLike = typeof sectorChurchId === 'number' || typeof sectorChurchId === 'string';
        const id = isIdLike ? Number(sectorChurchId) : NaN;
        if (!Number.isInteger(id) || id <= 0 || typeof password !== 'string' || password.length === 0) {
            throw new Error(INVALID_CREDENTIALS);
        }

        const church = await SectorChurch.findByPk(id);
        const valid = bcrypt.compareSync(password, church?.password ?? DUMMY_HASH);
        if (!church || !valid) {
            throw new Error(INVALID_CREDENTIALS);
        }

        logger.logAuthUsername(operation, church.name);
        return generateSectorToken(church.id, church.name);
    } catch (error: any) {
        logger.logError(operation, errorMessage(error));
        throw error;
    } finally {
        logger.logEnd(operation);
    }
};

export { listSectorChurches, loginSector };
