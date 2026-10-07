import { Op } from 'sequelize';
import SectorBaptismRecord from '../db/models/sectorBaptismRecord.model';
import logger from '../utils/logger';
import { ServiceResponse, NOT_FOUND, churchInclude, scopedWhere, toId, text, errorMessage } from './sector.util';

interface BaptismFields {
    childRUT: string;
    childFullName: string;
    childDateOfBirth: Date;
    fatherRUT: string | null;
    fatherFullName: string | null;
    motherRUT: string;
    motherFullName: string;
    placeOfRegistration: string;
    baptismDate: Date;
    registrationNumber: string;
    registrationDate: Date;
}

const REQUIRED_FIELDS: (keyof BaptismFields)[] = [
    'childRUT', 'childFullName', 'childDateOfBirth',
    'motherRUT', 'motherFullName', 'placeOfRegistration',
    'baptismDate', 'registrationNumber', 'registrationDate',
];

const DUPLICATE: ServiceResponse = { code: 400, message: 'Registro de bautizo ya existe para este RUT' };

const optionalText = (value: unknown): string | null => text(value) || null;

// Copia solo los campos del bautizo. Lo que no está aquí (id, deleted,
// sectorChurchId) nunca puede venir del cliente.
const pickFields = (data: any): BaptismFields => ({
    childRUT: text(data?.childRUT),
    childFullName: text(data?.childFullName),
    childDateOfBirth: data?.childDateOfBirth,
    fatherRUT: optionalText(data?.fatherRUT),
    fatherFullName: optionalText(data?.fatherFullName),
    motherRUT: text(data?.motherRUT),
    motherFullName: text(data?.motherFullName),
    placeOfRegistration: text(data?.placeOfRegistration),
    baptismDate: data?.baptismDate,
    registrationNumber: text(data?.registrationNumber),
    registrationDate: data?.registrationDate,
});

const missingField = (fields: BaptismFields): string | undefined => {
    return REQUIRED_FIELDS.find((field) => !fields[field]);
};

const toDTO = (record: SectorBaptismRecord) => {
    const plain: any = record.get({ plain: true });
    return { ...plain, sectorChurchName: plain.sectorChurch?.name ?? null };
};

const isUniqueViolation = (error: any): boolean => error?.name === 'SequelizeUniqueConstraintError';

const getAllSectorBaptisms = async (scopeId: number | undefined) => {
    const records = await SectorBaptismRecord.findAll({
        where: scopedWhere(scopeId),
        include: [churchInclude],
        order: [['createdAt', 'DESC']],
    });
    return records.map(toDTO);
};

const getSectorBaptismById = async (id: unknown, scopeId: number | undefined) => {
    const recordId = toId(id);
    if (recordId === null) return null;

    const record = await SectorBaptismRecord.findOne({
        where: { id: recordId, ...scopedWhere(scopeId) },
        include: [churchInclude],
    });
    return record ? toDTO(record) : null;
};

const countSectorBaptisms = async (scopeId: number | undefined): Promise<number> => {
    return await SectorBaptismRecord.count({ where: scopedWhere(scopeId) });
};

const createSectorBaptism = async (data: any, sectorChurchId: number): Promise<ServiceResponse> => {
    try {
        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        const existing = await SectorBaptismRecord.findOne({
            where: { childRUT: fields.childRUT, deleted: false },
        });
        if (existing) return DUPLICATE;

        await SectorBaptismRecord.create({ ...fields, sectorChurchId });
        return { code: 201, message: 'Registro de bautizo creado exitosamente' };
    } catch (error: any) {
        if (isUniqueViolation(error)) return DUPLICATE;
        logger.logError('SectorBaptismRecord - create', errorMessage(error));
        return { code: 500, message: 'Error interno del servidor al crear el registro de bautizo' };
    }
};

const updateSectorBaptism = async (id: unknown, data: any, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        const record = await SectorBaptismRecord.findOne({
            where: { id: recordId, ...scopedWhere(scopeId) },
        });
        if (!record) return NOT_FOUND;

        if (fields.childRUT !== record.childRUT) {
            const existing = await SectorBaptismRecord.findOne({
                where: { childRUT: fields.childRUT, deleted: false, id: { [Op.ne]: recordId } },
            });
            if (existing) return DUPLICATE;
        }

        await record.update(fields);
        return { code: 200, message: 'Registro de bautizo actualizado exitosamente' };
    } catch (error: any) {
        if (isUniqueViolation(error)) return DUPLICATE;
        logger.logError('SectorBaptismRecord - update', errorMessage(error));
        return { code: 500, message: 'Error interno del servidor al actualizar el registro de bautizo' };
    }
};

const deleteSectorBaptism = async (id: unknown, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const [updatedRows] = await SectorBaptismRecord.update(
            { deleted: true },
            { where: { id: recordId, ...scopedWhere(scopeId) } }
        );
        if (updatedRows === 0) return NOT_FOUND;

        return { code: 200, message: 'Registro de bautizo eliminado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorBaptismRecord - delete', errorMessage(error));
        return { code: 500, message: 'Error interno del servidor al eliminar el registro de bautizo' };
    }
};

export {
    getAllSectorBaptisms,
    getSectorBaptismById,
    countSectorBaptisms,
    createSectorBaptism,
    updateSectorBaptism,
    deleteSectorBaptism,
};
