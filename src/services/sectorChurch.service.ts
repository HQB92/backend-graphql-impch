import bcrypt from 'bcryptjs';
import SectorChurch from '../db/models/sectorChurch.model';

export interface ServiceResponse {
    code: number;
    message: string;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_FIELD_LENGTH = 255;
const PROFILE_FIELDS = ['pastor', 'address', 'phone'] as const;

type ProfileField = typeof PROFILE_FIELDS[number];
type ProfileInput = Partial<Record<ProfileField, unknown>>;

const WITHOUT_PASSWORD = { exclude: ['password'] };

const getAllSectorChurches = async (): Promise<SectorChurch[]> => {
    return await SectorChurch.findAll({
        attributes: WITHOUT_PASSWORD,
        order: [['name', 'ASC']],
    });
};

const getSectorChurchById = async (id: number): Promise<SectorChurch | null> => {
    return await SectorChurch.findByPk(id, { attributes: WITHOUT_PASSWORD });
};

const updateSectorChurchProfile = async (id: number, data: ProfileInput): Promise<ServiceResponse> => {
    const values: Partial<Record<ProfileField, string | null>> = {};

    for (const field of PROFILE_FIELDS) {
        const value = data[field];
        if (value === undefined) continue;
        if (value === null) {
            values[field] = null;
            continue;
        }
        if (typeof value !== 'string' || value.length > MAX_FIELD_LENGTH) {
            return { code: 400, message: `Valor inválido para ${field}` };
        }
        const trimmed = value.trim();
        values[field] = trimmed === '' ? null : trimmed;
    }

    if (Object.keys(values).length === 0) {
        return { code: 400, message: 'No hay datos para actualizar' };
    }

    const [updatedRows] = await SectorChurch.update(values, { where: { id } });
    if (updatedRows === 0) {
        return { code: 404, message: 'Iglesia no encontrada' };
    }
    return { code: 200, message: 'Perfil actualizado exitosamente' };
};

const changeSectorChurchPassword = async (id: number, currentPassword: unknown, newPassword: unknown): Promise<ServiceResponse> => {
    if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
        return { code: 400, message: `La nueva clave debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` };
    }

    const church = await SectorChurch.findByPk(id);
    if (!church) {
        return { code: 404, message: 'Iglesia no encontrada' };
    }
    if (typeof currentPassword !== 'string' || !bcrypt.compareSync(currentPassword, church.password)) {
        return { code: 400, message: 'Clave actual incorrecta' };
    }

    await church.update({ password: bcrypt.hashSync(newPassword, 10) });
    return { code: 200, message: 'Clave cambiada exitosamente' };
};

export {
    getAllSectorChurches,
    getSectorChurchById,
    updateSectorChurchProfile,
    changeSectorChurchPassword,
};
