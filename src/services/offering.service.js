const offering = require('../db/models/offering.model');
const ChurchModel = require('../db/models/church.model');
const { Op,fn, col, literal} = require('sequelize');

const createOffering = async (offeringData) => {
    try {
        const newOffering = await offering.create(offeringData);
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

const getSummaryAll = async (mes, anio, churchId) => {
    let filterChurch = {};
    try {
        if (!mes || !anio) {
            return {
                code: 400,
                message: 'Mes y año son requeridos',
            };
        }else if (mes < 10){
            mes = '0'+mes;
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
                    tableName: 'churches',
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
        return  results
    } catch (e) {
        console.error('Error al obtener el resumen:', e);
        return {
            code: 500,
            message: 'Error interno del servidor',
        };
    }
};


const updateOffering = async (offeringData, id) => {
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

const deleteOffering = async (id) => {
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

const getAllOfferings = async (user, church, mes, anio) => {
    let filterUser = {};
    let filterChurch = {};
    if (user && user !== 0) {
        filterUser = {userId: user};
    }

    if (church && church !== 0) {
        filterChurch = {churchId: church};
    }

    if (mes && mes < 10) {
        mes = '0'+mes;
    }

    try {
        return await offering.findAll({
            where: {
                [Op.and]: [
                    filterUser,
                    filterChurch,
                    literal(`EXTRACT(MONTH FROM "date") = ${mes}`),
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

module.exports = {
    createOffering,
    updateOffering,
    deleteOffering,
    getAllOfferings,
    getSummaryAll
}