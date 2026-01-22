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

const getAllOfferings = async (user?: number, church?: number, mes?: number, anio?: number): Promise<Offering[] | ServiceResponse> => {
    let filterUser: any = {};
    let filterChurch: any = {};
    let mesStr: string | number | undefined = mes;
    
    if (user && user !== 0) {
        filterUser = { userId: user };
    }

    if (church && church !== 0) {
        filterChurch = { churchId: church };
    }

    if (mesStr && typeof mesStr === 'number' && mesStr < 10) {
        mesStr = '0' + mesStr;
    }

    try {
        const conditions: any[] = [filterUser, filterChurch];
        
        if (mesStr && anio) {
            conditions.push(literal(`EXTRACT(MONTH FROM "date") = ${mesStr}`));
            conditions.push(literal(`EXTRACT(YEAR FROM "date") = ${anio}`));
        }

        return await Offering.findAll({
            where: {
                [Op.and]: conditions
            },
            order: [['id', 'ASC']]
        });
    } catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }
}

export {
    createOffering,
    updateOffering,
    deleteOffering,
    getAllOfferings,
    getSummaryAll
}
