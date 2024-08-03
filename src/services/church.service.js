
const ChurchModel = require('../db/models/church.model');

const getAllChurches = async () => {
    return await ChurchModel.findAll();
};

const getChurchById = async (id) => {
    return await ChurchModel.findByPk(id);
};

const createChurch = async (churchData) => {
    const { name } = churchData;
    const existingChurch = await ChurchModel.findOne({ where: { name } });
    if (existingChurch) {
        return {
            code: 400,
            message: 'Iglesia ya existe',
        };
    }
    await ChurchModel.create(churchData);
    return {
        code: 200,
        message: 'Iglesia creada Exitosamente',
    };
};

const updateChurch = async (churchData) => {
    const { id } = churchData;
    await ChurchModel.update(churchData, { where: { id } });
    return {
        code: 200,
        message: 'Iglesia actualizada Exitosamente',
    };
};

const deleteChurch = async (id) => {
    const result = await ChurchModel.destroy({ where: { id } });
    if (result === 0) {
        return {
            code: 400,
            message: 'Iglesia no existe',
        };
    }
    return {
        code: 200,
        message: 'Iglesia eliminada Exitosamente',
    };
};

module.exports = {
    getAllChurches,
    getChurchById,
    createChurch,
    updateChurch,
    deleteChurch,
};
