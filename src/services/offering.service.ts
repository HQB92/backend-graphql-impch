import Offering from '../db/models/offering.model';
import ChurchModel from '../db/models/church.model';
import { Op, fn, col, literal } from 'sequelize';

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

const createOffering = async (offeringData: OfferingData): Promise<ServiceResponse> => {
    try {
        const newOffering = await Offering.create(offeringData);
        if (newOffering) {
            return {
                code: 201,
                message: 'Ofrenda registrada correctamente',
            }
        } else {
            return {
                code: 400,
                message: 'Error al registrar la ofrenda',
            }
        }
    } catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }
}

const getSummaryAll = async (mes: number | string, anio: number, churchId?: number): Promise<any> => {
    let filterChurch: any = {};
    try {
        if (!mes || !anio) {
            return {
                code: 400,
                message: 'Mes y año son requeridos',
            };
        } else if (typeof mes === 'number' && mes < 10) {
            mes = '0' + mes;
        }
        if (churchId) {
            filterChurch = { churchId: churchId };
        }

        const results = await Offering.findAll({
            attributes: [
                'churchId',
                [fn('sum', col('amount')), 'total'],
                [fn('count', col('amount')), 'count'],
                [literal(`"church"."name"`), 'name']
            ],
            include: [
                {
                    model: ChurchModel,
                    as: 'church',
                    attributes: ['name'],
                    required: true
                }
            ],
            where: {
                [Op.and]: [
                    literal(`EXTRACT(MONTH FROM "date") = ${mes}`),
                    literal(`EXTRACT(YEAR FROM "date") = ${anio}`),
                    filterChurch
                ]
            },
            group: ['churchId', 'church.id'],
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
};

const updateOffering = async (offeringData: Partial<OfferingData>, id: number): Promise<ServiceResponse> => {
    try {
        const offeringToUpdate = await Offering.findByPk(id);
        if (!offeringToUpdate) {
            return {
                code: 400,
                message: 'Ofrenda no existe',
            }
        }
        await Offering.update(offeringData, { where: { id } });
        return {
            code: 200,
            message: 'Ofrenda actualizada correctamente',
        }
    } catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }
}

const deleteOffering = async (id: number): Promise<ServiceResponse> => {
    try {
        const offeringToDelete = await Offering.findByPk(id);
        if (!offeringToDelete) {
            return {
                code: 400,
                message: 'Ofrenda no existe',
            }
        }
        await Offering.destroy({ where: { id } });
        return {
            code: 200,
            message: 'Ofrenda eliminada correctamente',
        }
    } catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }
}

const toInt = (v: unknown): number | undefined => {
    const n = Number(v);
    return Number.isInteger(n) && n !== 0 ? n : undefined;
};

const getAllOfferings = async (user?: number, church?: number, mes?: number, anio?: number): Promise<Offering[]> => {
    const conditions: any[] = [];

    const userId = toInt(user);
    if (userId) conditions.push({ userId });

    const churchId = toInt(church);
    if (churchId) conditions.push({ churchId });

    const mesNum = toInt(mes);
    const anioNum = toInt(anio);
    if (mesNum && anioNum) {
        const mesStr = mesNum < 10 ? `0${mesNum}` : `${mesNum}`;
        conditions.push(literal(`EXTRACT(MONTH FROM "date") = ${mesStr}`));
        conditions.push(literal(`EXTRACT(YEAR FROM "date") = ${anioNum}`));
    }

    return await Offering.findAll({
        where: conditions.length ? { [Op.and]: conditions } : {},
        order: [['id', 'ASC']]
    });
}

export {
    createOffering,
    updateOffering,
    deleteOffering,
    getAllOfferings,
    getSummaryAll
}
