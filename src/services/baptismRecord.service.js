const BaptismRecordService = require('../db/models/baptismRecord.model');
const logger = require('../utils/logger');

const getAllBaptismRecords = async () => {
    try {
        return await BaptismRecordService.findAll({order: [['baptismDate', 'DESC']]});
    } catch (error) {
        logger.logError('BaptismRecord - getAllBaptismRecords', error);
        throw error;
    }
};

const getBaptismRecordById = async (id) => {
    try {
        return await BaptismRecordService.findByPk(id);
    } catch (error) {
        logger.logError('BaptismRecord - getBaptismRecordById', error);
        throw error;
    }
};

const getBaptismRecordByChildRUT = async (childRUT) => {
    try {
        return await BaptismRecordService.findOne({ where: { childRUT } });
    } catch (error) {
        logger.logError('BaptismRecord - getBaptismRecordByChildRUT', error);
        throw error;
    }
};

const createBaptismRecord = async (baptismRecordData) => {
    try {
        // Validar campos requeridos
        const requiredFields = [
            'childRUT', 'childFullName', 'childDateOfBirth',
            'motherRUT', 'motherFullName', 'placeOfRegistration',
            'baptismDate', 'registrationNumber', 'registrationDate'
        ];

        for (const field of requiredFields) {
            if (!baptismRecordData[field]) {
                return {
                    code: 400,
                    message: `Campo requerido faltante: ${field}`,
                };
            }
        }

        // Verificar si ya existe un registro con el mismo childRUT
        const existingRecord = await BaptismRecordService.findOne({
            where: { childRUT: baptismRecordData.childRUT }
        });

        if (existingRecord) {
            return {
                code: 400,
                message: 'Registro de bautizo ya existe para este RUT',
            };
        }

        // Crear el registro
        const newRecord = await BaptismRecordService.create(baptismRecordData);

        logger.logResponse('BaptismRecord - createBaptismRecord', newRecord);

        return {
            code: 200,
            message: 'Registro de bautizo creado exitosamente',
            data: newRecord
        };
    } catch (error) {
        logger.logError('BaptismRecord - createBaptismRecord', error);
        return {
            code: 500,
            message: 'Error interno del servidor al crear el registro de bautizo',
            error: error.message
        };
    }
};

const updateBaptismRecord = async (baptismRecordData) => {
    try {
        const { childRUT } = baptismRecordData;

        if (!childRUT) {
            return {
                code: 400,
                message: 'childRUT es requerido para actualizar el registro',
            };
        }

        // Verificar si el registro existe
        const existingRecord = await BaptismRecordService.findOne({
            where: { childRUT }
        });

        if (!existingRecord) {
            return {
                code: 404,
                message: 'Registro de bautizo no encontrado',
            };
        }

        // Actualizar el registro
        await BaptismRecordService.update(baptismRecordData, {
            where: { childRUT }
        });

        logger.logResponse('BaptismRecord - updateBaptismRecord', { childRUT });

        return {
            code: 200,
            message: 'Registro de bautizo actualizado exitosamente',
        };
    } catch (error) {
        logger.logError('BaptismRecord - updateBaptismRecord', error);
        return {
            code: 500,
            message: 'Error interno del servidor al actualizar el registro de bautizo',
            error: error.message
        };
    }
};

const deleteBaptismRecord = async (childRUT) => {
    try {
        if (!childRUT) {
            return {
                code: 400,
                message: 'childRUT es requerido para eliminar el registro',
            };
        }

        const result = await BaptismRecordService.destroy({
            where: { childRUT }
        });

        if (result === 0) {
            return {
                code: 404,
                message: 'Registro de bautizo no encontrado',
            };
        }

        logger.logResponse('BaptismRecord - deleteBaptismRecord', { childRUT });

        return {
            code: 200,
            message: 'Registro de bautizo eliminado exitosamente',
        };
    } catch (error) {
        logger.logError('BaptismRecord - deleteBaptismRecord', error);
        return {
            code: 500,
            message: 'Error interno del servidor al eliminar el registro de bautizo',
            error: error.message
        };
    }
};

module.exports = {
    getAllBaptismRecords,
    getBaptismRecordById,
    getBaptismRecordByChildRUT,
    createBaptismRecord,
    updateBaptismRecord,
    deleteBaptismRecord,
};
