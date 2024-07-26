// src/service/statusService.js
const StatusService = require('../db/models/status.model');

const getAllStatuses = async () => {
    return await StatusService.findAll();
};

const getStatusById = async (id) => {
    return await StatusService.findByPk(id);
};

const createStatus = async (statusData) => {
    const { name } = statusData;
    const existingStatus = await StatusService.findOne({ where: { name } });
    if (existingStatus) {
        return {
            code: 400,
            message: 'Estado ya existe',
        };
    }
    await StatusService.create(statusData);
    return {
        code: 200,
        message: 'Estado creado Exitosamente',
    };
};

const updateStatus = async (statusData) => {
    const { id } = statusData;
    await StatusService.update(statusData, { where: { id } });
    return {
        code: 200,
        message: 'Estado actualizado Exitosamente',
    };
};

const deleteStatus = async (id) => {
    const result = await StatusService.destroy({ where: { id } });
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
