const BaptismRecordService = require('../db/models/baptismRecord.model');

const getAllBaptismRecords = async () => {
    return await BaptismRecordService.findAll({order: [['baptismDate', 'DESC']]});
};

const getBaptismRecordById = async (id) => {
    return await BaptismRecordService.findByPk(id);
};

const createBaptismRecord = async (baptismRecordData) => {
    const { childRUT } = baptismRecordData;
    const existingRecord = await BaptismRecordService.findOne({ where: { childRUT } });
    if (existingRecord) {
        return {
            code: 400,
            message: 'Registro de bautizo ya existe',
        };
    }
    await BaptismRecordService.create(baptismRecordData);
    return {
        code: 200,
        message: 'Registro de bautizo creado Exitosamente',
    };
};

const updateBaptismRecord = async (baptismRecordData) => {
    const { id } = baptismRecordData;
    await BaptismRecordService.update(baptismRecordData, { where: { id } });
    return {
        code: 200,
        message: 'Registro de bautizo actualizado Exitosamente',
    };
};

const deleteBaptismRecord = async (id) => {
    const result = await BaptismRecordService.destroy({ where: { id } });
    if (result === 0) {
        return {
            code: 400,
            message: 'Registro de bautizo no existe',
        };
    }
    return {
        code: 200,
        message: 'Registro de bautizo eliminado Exitosamente',
    };
};

module.exports = {
    getAllBaptismRecords,
    getBaptismRecordById,
    createBaptismRecord,
    updateBaptismRecord,
    deleteBaptismRecord,
};
