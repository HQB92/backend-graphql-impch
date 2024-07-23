const BaptismRecord = require('../db/models/baptismRecord');

const getAllBaptismRecords = async () => {
    return await BaptismRecord.findAll();
};

const getBaptismRecordById = async (id) => {
    return await BaptismRecord.findByPk(id);
};

const createBaptismRecord = async (baptismRecordData) => {
    const { rutChild } = baptismRecordData;
    const existingRecord = await BaptismRecord.findOne({ where: { rutChild } });
    if (existingRecord) {
        return {
            code: 400,
            message: 'Registro de bautizo ya existe',
        };
    }
    await BaptismRecord.create(baptismRecordData);
    return {
        code: 200,
        message: 'Registro de bautizo creado Exitosamente',
    };
};

const updateBaptismRecord = async (baptismRecordData) => {
    const { id } = baptismRecordData;
    await BaptismRecord.update(baptismRecordData, { where: { id } });
    return {
        code: 200,
        message: 'Registro de bautizo actualizado Exitosamente',
    };
};

const deleteBaptismRecord = async (id) => {
    const result = await BaptismRecord.destroy({ where: { id } });
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
