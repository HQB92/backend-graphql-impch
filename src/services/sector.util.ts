import SectorChurch from '../db/models/sectorChurch.model';

export interface ServiceResponse {
    code: number;
    message: string;
}

export const NOT_FOUND: ServiceResponse = { code: 404, message: 'Registro no encontrado' };

export const churchInclude = { model: SectorChurch, as: 'sectorChurch', attributes: ['name'] };

export const scopedWhere = (scopeId: number | undefined) => ({
    deleted: false,
    ...(scopeId !== undefined ? { sectorChurchId: scopeId } : {}),
});

export const toId = (id: unknown): number | null => {
    if (typeof id !== 'number' && typeof id !== 'string') return null;
    const n = Number(id);
    return Number.isInteger(n) && n > 0 ? n : null;
};

export const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

// Solo el mensaje: un error de Sequelize trae el SQL y sus parámetros (RUT,
// nombres, hashes) y no debe llegar a los logs.
export const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));
