import SectorMerriageRecord from '../db/models/sectorMerriageRecord.model';
import SectorChurch from '../db/models/sectorChurch.model';
import logger from '../utils/logger';

export interface ServiceResponse {
    code: number;
    message: string;
}

interface MerriageFields {
    husbandId: string;
    fullNameHusband: string;
    wifeId: string;
    fullNameWife: string;
    civilCode: number;
    civilDate: Date;
    civilPlace: string;
    religiousDate: Date;
}

const REQUIRED_FIELDS: (keyof MerriageFields)[] = [
    'husbandId', 'fullNameHusband', 'wifeId', 'fullNameWife',
    'civilCode', 'civilDate', 'civilPlace', 'religiousDate',
];

const NOT_FOUND: ServiceResponse = { code: 404, message: 'Registro no encontrado' };

const churchInclude = { model: SectorChurch, as: 'sectorChurch', attributes: ['name'] };

const scopedWhere = (scopeId: number | undefined) => ({
    deleted: false,
    ...(scopeId !== undefined ? { sectorChurchId: scopeId } : {}),
});

const toId = (id: unknown): number | null => {
    if (typeof id !== 'number' && typeof id !== 'string') return null;
    const n = Number(id);
    return Number.isInteger(n) && n > 0 ? n : null;
};

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

// 0 si no es un entero positivo, para que la validación de requeridos lo rechace.
const positiveInt = (value: unknown): number => {
    return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : 0;
};

// Copia solo los campos del matrimonio. Lo que no está aquí (id, deleted,
// sectorChurchId) nunca puede venir del cliente.
const pickFields = (data: any): MerriageFields => ({
    husbandId: text(data?.husbandId),
    fullNameHusband: text(data?.fullNameHusband),
    wifeId: text(data?.wifeId),
    fullNameWife: text(data?.fullNameWife),
    civilCode: positiveInt(data?.civilCode),
    civilDate: data?.civilDate,
    civilPlace: text(data?.civilPlace),
    religiousDate: data?.religiousDate,
});

const missingField = (fields: MerriageFields): string | undefined => {
    return REQUIRED_FIELDS.find((field) => !fields[field]);
};

const toDTO = (record: SectorMerriageRecord) => {
    const plain: any = record.get({ plain: true });
    return { ...plain, sectorChurchName: plain.sectorChurch?.name ?? null };
};

const getAllSectorMerriages = async (scopeId: number | undefined) => {
    const records = await SectorMerriageRecord.findAll({
        where: scopedWhere(scopeId),
        include: [churchInclude],
        order: [['id', 'DESC']],
    });
    return records.map(toDTO);
};

const getSectorMerriageById = async (id: unknown, scopeId: number | undefined) => {
    const recordId = toId(id);
    if (recordId === null) return null;

    const record = await SectorMerriageRecord.findOne({
        where: { id: recordId, ...scopedWhere(scopeId) },
        include: [churchInclude],
    });
    return record ? toDTO(record) : null;
};

const countSectorMerriages = async (scopeId: number | undefined): Promise<number> => {
    return await SectorMerriageRecord.count({ where: scopedWhere(scopeId) });
};

const createSectorMerriage = async (data: any, sectorChurchId: number): Promise<ServiceResponse> => {
    try {
        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        await SectorMerriageRecord.create({ ...fields, sectorChurchId });
        return { code: 201, message: 'Certificado de Matrimonio creado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorMerriageRecord - create', error);
        return { code: 500, message: 'Error interno del servidor al crear el registro de matrimonio' };
    }
};

const updateSectorMerriage = async (id: unknown, data: any, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        const [updatedRows] = await SectorMerriageRecord.update(
            fields,
            { where: { id: recordId, ...scopedWhere(scopeId) } }
        );
        if (updatedRows === 0) return NOT_FOUND;

        return { code: 200, message: 'Registro de matrimonio actualizado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorMerriageRecord - update', error);
        return { code: 500, message: 'Error interno al actualizar el registro de matrimonio' };
    }
};

const deleteSectorMerriage = async (id: unknown, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const [updatedRows] = await SectorMerriageRecord.update(
            { deleted: true },
            { where: { id: recordId, ...scopedWhere(scopeId) } }
        );
        if (updatedRows === 0) return NOT_FOUND;

        return { code: 200, message: 'Registro de matrimonio eliminado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorMerriageRecord - delete', error);
        return { code: 500, message: 'Error interno del servidor al eliminar el registro de matrimonio' };
    }
};

export {
    getAllSectorMerriages,
    getSectorMerriageById,
    countSectorMerriages,
    createSectorMerriage,
    updateSectorMerriage,
    deleteSectorMerriage,
};
