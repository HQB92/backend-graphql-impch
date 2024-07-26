
const ChurchService = require('../db/models/church.model');

const getAllChurches = async () => {
    return await ChurchService.findAll();
};

const getChurchById = async (id) => {
    return await ChurchService.findByPk(id);
};

const createChurch = async (churchData) => {
    const { name } = churchData;
    const existingChurch = await ChurchService.findOne({ where: { name } });
    if (existingChurch) {
        return {
            code: 400,
            message: 'Iglesia ya existe',
        };
    }
    await ChurchService.create(churchData);
    return {
        code: 200,
        message: 'Iglesia creada Exitosamente',
    };
};

const updateChurch = async (churchData) => {
    const { id } = churchData;
    await ChurchService.update(churchData, { where: { id } });
    return {
        code: 200,
        message: 'Iglesia actualizada Exitosamente',
    };
};

const deleteChurch = async (id) => {
    const result = await ChurchService.destroy({ where: { id } });
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
