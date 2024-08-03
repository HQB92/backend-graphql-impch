import offering from '../db/models/offering.model';
import ChurchModel from '../db/models/church.model';
import { Op,fn, col, literal} from 'sequelize';

const  createOffering = async (offeringData:any) => {
    try {
        const  newOffering = await offering.create(offeringData);
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

const getSummaryAll = async (mes:number, anio:number, churchId:number) => {
    let filterChurch = {};
    const month: string = mes < 10 ? '0'+mes : mes.toString();
    try {
        if (!mes || !anio) {
            return {
                code: 400,
                message: 'Mes y año son requeridos',
            };
        }
        if(churchId){
            filterChurch = { churchId: churchId };
        }

        const results = await offering.findAll({
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
                    literal(`EXTRACT(MONTH FROM "date") = ${month}`),
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
        return  results
    } catch (e) {
        console.error('Error al obtener el resumen:', e);
        return {
            code: 500,
            message: 'Error interno del servidor',
        };
    }
};


const  updateOffering = async (offeringData:any, id:number) => {
    try {
        const offeringToUpdate = await offering.findByPk(id);
        if (!offeringToUpdate) {
            return {
                code: 400,
                message: 'Ofrenda no existe',
            }
        }
        await offering.update(offeringData, {where: {id}});
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

const deleteOffering = async (id:number) => {
    try {
        const offeringToDelete = await offering.findByPk(id);
        if (!offeringToDelete) {
            return {
                code: 400,
                message: 'Ofrenda no existe',
            }
        }
        await offering.destroy({where: {id}});
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

const getAllOfferings = async (user:number, church:number, mes:number, anio:number) => {
    let filterUser = {};
    let filterChurch = {};
    const month: string = mes < 10 ? '0'+mes : mes.toString();
    if (user && user !== 0) {
        filterUser = {userId: user};
    }
    if (church && church !== 0) {
        filterChurch = {churchId: church};
    }
    try {
        return await offering.findAll({
            where: {
                [Op.and]: [
                    filterUser,
                    filterChurch,
                    literal(`EXTRACT(MONTH FROM "date") = ${month}`),
                    literal(`EXTRACT(YEAR FROM "date") = ${anio}`)
                ]
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

export default {
    createOffering,
    updateOffering,
    deleteOffering,
    getAllOfferings,
    getSummaryAll
}