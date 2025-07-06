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

const getBaptismRecordByChildRut = async (childRut) => {
    try {
        return await BaptismRecordService.findOne({ where: { childRut } });
    } catch (error) {
        logger.logError('BaptismRecord - getBaptismRecordByChildRut', error);
        throw error;
    }
};

const createBaptismRecord = async (baptismRecordData) => {
    try {
        // Validar campos requeridos
        const requiredFields = [
            'childRut', 'childFullName', 'childDateOfBirth',
            'motherRut', 'motherFullName', 'placeOfRegistration',
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

        // Verificar si ya existe un registro con el mismo childRut
        const existingRecord = await BaptismRecordService.findOne({
            where: { childRut: baptismRecordData.childRut }
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
        const { childRut } = baptismRecordData;

        if (!childRut) {
            return {
                code: 400,
                message: 'childRut es requerido para actualizar el registro',
            };
        }

        // Verificar si el registro existe
        const existingRecord = await BaptismRecordService.findOne({
            where: { childRut }
        });

        if (!existingRecord) {
            return {
                code: 404,
                message: 'Registro de bautizo no encontrado',
            };
        }

        // Actualizar el registro
        await BaptismRecordService.update(baptismRecordData, {
            where: { childRut }
        });

        logger.logResponse('BaptismRecord - updateBaptismRecord', { childRut });

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

const deleteBaptismRecord = async (childRut) => {
    try {
        if (!childRut) {
            return {
                code: 400,
                message: 'childRut es requerido para eliminar el registro',
            };
        }

        const result = await BaptismRecordService.destroy({
            where: { childRut }
        });

        if (result === 0) {
            return {
                code: 404,
                message: 'Registro de bautizo no encontrado',
            };
        }

        logger.logResponse('BaptismRecord - deleteBaptismRecord', { childRut });

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
    getBaptismRecordByChildRut,
    createBaptismRecord,
    updateBaptismRecord,
    deleteBaptismRecord,
};
