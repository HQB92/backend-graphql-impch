import Expense from '../db/models/expense.model';
import { Op, fn, col } from 'sequelize';
import { monthRange } from '../utils/dateRange';

interface ExpenseData {
    amount: number;
    date: Date;
    type?: string | null;
    description?: string | null;
    source: string;
    churchId: number;
    userId: number;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const toInt = (v: unknown): number | undefined => {
    const n = Number(v);
    return Number.isInteger(n) && n !== 0 ? n : undefined;
};

const getAllExpenses = async (churchId?: number, mes?: number, anio?: number, source?: string): Promise<Expense[]> => {
    const conditions: any[] = [{ deleted: false }];

    const cid = toInt(churchId);
    if (cid) conditions.push({ churchId: cid });

    if (source) conditions.push({ source });

    const range = monthRange(mes, anio);
    if (range) {
        conditions.push({ date: { [Op.gte]: range.start, [Op.lt]: range.end } });
    }

    return await Expense.findAll({
        where: { [Op.and]: conditions },
        order: [['date', 'DESC'], ['id', 'DESC']]
    });
};

const getExpenseById = async (id: number): Promise<Expense | null> => {
    return await Expense.findByPk(id);
};

const createExpense = async (data: ExpenseData): Promise<ServiceResponse> => {
    try {
        await Expense.create(data);
        return { code: 200, message: 'Gasto registrado exitosamente' };
    } catch (error: any) {
        return { code: 400, message: 'Error al registrar gasto: ' + error.message };
    }
};

const updateExpense = async (id: number, data: Partial<ExpenseData>): Promise<ServiceResponse> => {
    try {
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return { code: 404, message: 'Gasto no encontrado' };
        }
        await Expense.update(data, { where: { id } });
        return { code: 200, message: 'Gasto actualizado exitosamente' };
    } catch (error: any) {
        return { code: 400, message: 'Error al actualizar gasto: ' + error.message };
    }
};

const deleteExpense = async (id: number): Promise<ServiceResponse> => {
    try {
        const result = await Expense.update({ deleted: true }, { where: { id } });
        if (result[0] === 0) {
            return { code: 404, message: 'Gasto no encontrado' };
        }
        return { code: 200, message: 'Gasto eliminado exitosamente' };
    } catch (error: any) {
        return { code: 400, message: 'Error al eliminar gasto: ' + error.message };
    }
};

const getSummaryExpenses = async (mes: number, anio: number, churchId?: number): Promise<any> => {
    const range = monthRange(mes, anio);
    if (!range) return [];

    const conditions: any[] = [
        { deleted: false },
        { date: { [Op.gte]: range.start, [Op.lt]: range.end } },
    ];
    const cid = toInt(churchId);
    if (cid) conditions.push({ churchId: cid });

    return await Expense.findAll({
        attributes: [
            'churchId',
            'source',
            [fn('sum', col('amount')), 'total'],
            [fn('count', col('amount')), 'count'],
        ],
        where: { [Op.and]: conditions },
        group: ['churchId', 'source']
    });
};

export {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getSummaryExpenses
};
