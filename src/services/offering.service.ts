import Offering from '../db/models/offering.model';
import ChurchModel from '../db/models/church.model';
import { Op, fn, col, literal } from 'sequelize';
import { monthRange } from '../utils/dateRange';

interface OfferingData {
    amount: number;
    date: Date;
    type?: string | null;
    churchId: number;
    userId: number;
    state: boolean;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const toInt = (v: unknown): number | undefined => {
    const n = Number(v);
    return Number.isInteger(n) && n !== 0 ? n : undefined;
};

const createOffering = async (offeringData: OfferingData): Promise<ServiceResponse> => {
    try {
        const newOffering = await Offering.create(offeringData);
        if (newOffering) {
            return { code: 201, message: 'Ofrenda registrada correctamente' };
        }
        return { code: 400, message: 'Error al registrar la ofrenda' };
    } catch (e) {
        return { code: 500, message: 'Error interno del servidor' };
    }
};

const getSummaryAll = async (mes: number, anio: number, churchId?: number): Promise<any> => {
    const range = monthRange(mes, anio);
    if (!range) {
        return { code: 400, message: 'Mes y año son requeridos' };
    }

    const conditions: any[] = [
        { deleted: false },
        { date: { [Op.gte]: range.start, [Op.lt]: range.end } },
    ];
    const cid = toInt(churchId);
    if (cid) conditions.push({ churchId: cid });

    return await Offering.findAll({
        attributes: [
            'churchId',
            [fn('sum', col('amount')), 'total'],
            [fn('count', col('amount')), 'count'],
            [literal(`"church"."name"`), 'name']
        ],
        include: [
            { model: ChurchModel, as: 'church', attributes: ['name'], required: true }
        ],
        where: { [Op.and]: conditions },
        group: ['churchId', 'church.id'],
    });
};

const updateOffering = async (offeringData: Partial<OfferingData>, id: number): Promise<ServiceResponse> => {
    try {
        const offeringToUpdate = await Offering.findByPk(id);
        if (!offeringToUpdate) {
            return { code: 400, message: 'Ofrenda no existe' };
        }
        await Offering.update(offeringData, { where: { id } });
        return { code: 200, message: 'Ofrenda actualizada correctamente' };
    } catch (e) {
        return { code: 500, message: 'Error interno del servidor' };
    }
};

const deleteOffering = async (id: number): Promise<ServiceResponse> => {
    try {
        const offeringToDelete = await Offering.findByPk(id);
        if (!offeringToDelete) {
            return { code: 400, message: 'Ofrenda no existe' };
        }
        await Offering.update({ deleted: true }, { where: { id } });
        return { code: 200, message: 'Ofrenda eliminada correctamente' };
    } catch (e) {
        return { code: 500, message: 'Error interno del servidor' };
    }
};

const getAllOfferings = async (user?: number, church?: number, mes?: number, anio?: number): Promise<Offering[]> => {
    const conditions: any[] = [{ deleted: false }];

    const userId = toInt(user);
    if (userId) conditions.push({ userId });

    const churchId = toInt(church);
    if (churchId) conditions.push({ churchId });

    const range = monthRange(mes, anio);
    if (range) {
        conditions.push({ date: { [Op.gte]: range.start, [Op.lt]: range.end } });
    }

    return await Offering.findAll({
        where: { [Op.and]: conditions },
        order: [['id', 'ASC']]
    });
};

export {
    createOffering,
    updateOffering,
    deleteOffering,
    getAllOfferings,
    getSummaryAll
}
