const Bank = require('../db/models/bank.model');

const { Op,fn, col, literal} = require('sequelize');

const getSummaryBank = async (month, year) => {
    try {
        const results = await Bank.findAll({
            attributes: [
                'churchId',
                [fn('sum', col('amount')), 'total'],
                [fn('count', col('amount')), 'count'],
            ],
            where: {
                [Op.and]: [
                    literal(`EXTRACT(MONTH FROM "date") = ${month}`),
                    literal(`EXTRACT(YEAR FROM "date") = ${year}`)
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

module.exports = {
    getSummaryBank
}