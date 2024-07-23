
const Church = require('../db/models/church');

const getAllChurches = async () => {
    return await Church.findAll();
};

const getChurchById = async (id) => {
    return await Church.findByPk(id);
};

const createChurch = async (churchData) => {
    const { name } = churchData;
    const existingChurch = await Church.findOne({ where: { name } });
    if (existingChurch) {
        return {
            code: 400,
            message: 'Iglesia ya existe',
        };
    }
    await Church.create(churchData);
    return {
        code: 200,
        message: 'Iglesia creada Exitosamente',
    };
};

const updateChurch = async (churchData) => {
    const { id } = churchData;
    await Church.update(churchData, { where: { id } });
    return {
        code: 200,
        message: 'Iglesia actualizada Exitosamente',
    };
};

const deleteChurch = async (id) => {
    const result = await Church.destroy({ where: { id } });
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
