// src/service/statusService.js
const Status = require('../db/models/status');

const getAllStatuses = async () => {
    return await Status.findAll();
};

const getStatusById = async (id) => {
    return await Status.findByPk(id);
};

const createStatus = async (statusData) => {
    const { name } = statusData;
    const existingStatus = await Status.findOne({ where: { name } });
    if (existingStatus) {
        return {
            code: 400,
            message: 'Estado ya existe',
        };
    }
    await Status.create(statusData);
    return {
        code: 200,
        message: 'Estado creado Exitosamente',
    };
};

const updateStatus = async (statusData) => {
    const { id } = statusData;
    await Status.update(statusData, { where: { id } });
    return {
        code: 200,
        message: 'Estado actualizado Exitosamente',
    };
};

const deleteStatus = async (id) => {
    const result = await Status.destroy({ where: { id } });
    if (result === 0) {
        return {
            code: 400,
            message: 'Estado no existe',
        };
    }
    return {
        code: 200,
        message: 'Estado eliminado Exitosamente',
    };
};

module.exports = {
    getAllStatuses,
    getStatusById,
    createStatus,
    updateStatus,
    deleteStatus,
};
