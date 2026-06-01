import Bank from '../db/models/bank.model';
import { Op, fn, col } from 'sequelize';
import { monthRange } from '../utils/dateRange';

const toInt = (v: unknown): number | undefined => {
    const n = Number(v);
    return Number.isInteger(n) && n !== 0 ? n : undefined;
};

interface BankData {
    amount: number;
    date: Date;
    type?: string | null;
    churchId: number;
    userId: number;
    state: boolean;
    comment: string;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const getAllBanks = async (churchId?: number, month?: number, year?: number): Promise<Bank[]> => {
    const conditions: any[] = [{ deleted: false }];

    const cid = toInt(churchId);
    if (cid) conditions.push({ churchId: cid });

    const range = monthRange(month, year);
    if (range) {
        conditions.push({ date: { [Op.gte]: range.start, [Op.lt]: range.end } });
    }

    return await Bank.findAll({
        where: { [Op.and]: conditions },
        order: [['date', 'DESC'], ['id', 'DESC']]
    });
};

const getBankById = async (id: number): Promise<Bank | null> => {
    return await Bank.findByPk(id);
};

const createBank = async (bankData: BankData): Promise<ServiceResponse> => {
    try {
        await Bank.create(bankData);
        return {
            code: 200,
            message: 'Movimiento bancario creado exitosamente',
        };
    } catch (error: any) {
        return {
            code: 400,
            message: 'Error al crear movimiento bancario: ' + error.message,
        };
    }
};

const updateBank = async (id: number, bankData: Partial<BankData>): Promise<ServiceResponse> => {
    try {
        const bank = await Bank.findByPk(id);
        if (!bank) {
            return {
                code: 404,
                message: 'Movimiento bancario no encontrado',
            };
        }
        await Bank.update(bankData, { where: { id } });
        return {
            code: 200,
            message: 'Movimiento bancario actualizado exitosamente',
        };
    } catch (error: any) {
        return {
            code: 400,
            message: 'Error al actualizar movimiento bancario: ' + error.message,
        };
    }
};

const deleteBank = async (id: number): Promise<ServiceResponse> => {
    try {
        const result = await Bank.update({ deleted: true }, { where: { id } });
        if (result[0] === 0) {
            return {
                code: 404,
                message: 'Movimiento bancario no encontrado',
            };
        }
        return {
            code: 200,
            message: 'Movimiento bancario eliminado exitosamente',
        };
    } catch (error: any) {
        return {
            code: 400,
            message: 'Error al eliminar movimiento bancario: ' + error.message,
        };
    }
};

const getSummaryBank = async (month: number, year: number): Promise<any> => {
    const range = monthRange(month, year);
    if (!range) {
        return { code: 400, message: 'Mes y año son requeridos' };
    }
    try {
        const results = await Bank.findAll({
            attributes: [
                'churchId',
                [fn('sum', col('amount')), 'total'],
                [fn('count', col('amount')), 'count'],
            ],
            where: {
                [Op.and]: [
                    { deleted: false },
                    { date: { [Op.gte]: range.start, [Op.lt]: range.end } }
                ]
            },
            group: ['churchId']
        });

        if (!results.length) {
            return {
                code: 404,
                message: 'No se encontraron resultados para el mes y año especificados',
            };
        }
        return results
    } catch (e) {
        console.error('Error al obtener el resumen:', e);
        return {
            code: 500,
            message: 'Error interno del servidor',
        };
    }
}

export {
    getAllBanks,
    getBankById,
    createBank,
    updateBank,
    deleteBank,
    getSummaryBank
}
