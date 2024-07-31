const offering = require('../db/models/offering.model');

const createOffering = async (offeringData) => {
    try {
        const newOffering = await offering.create(offeringData);
        if (newOffering) {
            return {
                code: 201,
                message: 'Ofrenda registrada correctamente',
            }
        }else{
            return {
                code: 400,
                message: 'Error al registrar la ofrenda',
            }
        }
    }catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }
}

const getSummaryAll = async (mes, anio) => {
//agrupar por iglesia y sumar el total de ofrendas y cantidad de ofrendas los item son churchId, Total, Count del mes y anio selecionado
    try {
        return await offering.findAll({
            attributes: ['churchId', [sequelize.fn('sum', sequelize.col('amount')), 'total'], [sequelize.fn('count', sequelize.col('amount')), 'count']],
            where: sequelize.where(sequelize.fn('month', sequelize.col('date')), mes),
            where: sequelize.where(sequelize.fn('year', sequelize.col('date')), anio),
            group: ['churchId']
        });
    }catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }


}

const updateOffering = async (offeringData, id) => {
    try {
        const offeringToUpdate = await offering.findByPk(id);
        if (!offeringToUpdate) {
            return {
                code: 400,
                message: 'Ofrenda no existe',
            }
        }
        await offering.update(offeringData, { where: { id } });
        return {
            code: 200,
            message: 'Ofrenda actualizada correctamente',
        }
    }catch (e) {
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
        await offering.destroy({ where: { id } });
        return {
            code: 200,
            message: 'Ofrenda eliminada correctamente',
        }
    }catch (e) {
        return {
            code: 500,
            message: 'Error interno del servidor',
        }
    }
}

const getAllOfferings = async (user, church) => {
    let filterUser = {};
    let filterChurch = {};
    if (user && user !== 0 ){
        filterUser = { userId: user };
    }

    if (church && church !== 0 ){
        filterChurch = { churchId: church };
    }
    try {
        return await offering.findAll({where: {...filterUser, ...filterChurch}})
    }catch (e) {
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