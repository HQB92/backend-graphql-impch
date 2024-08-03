import ChurchModel from '../db/models/church.model'

const getAllChurches = async () => {
    return await ChurchModel.findAll();
};

const getChurchById = async (id:number) => {
    return await ChurchModel.findByPk(id);
};

const  createChurch = async (churchData:any) => {
    const { name } = churchData;
    const existingChurch = await ChurchModel.findOne({ where: { name } });
    if (existingChurch) {
        return {
            code: 400,
            message: 'Iglesia ya existe',
        };
    }
    const response = await ChurchModel.create(churchData);
    if (response) {
        return {
            code: 200,
            message: 'Iglesia creada Exitosamente',
        };
    }else{
        return {
            code: 500,
            message: 'Error al crear la iglesia',
        };
    }
}

const updateChurch = async (churchData:any) => {
    const { id } = churchData;
    await ChurchModel.update(churchData, { where: { id } });
    return {
        code: 200,
        message: 'Iglesia actualizada Exitosamente',
    };
}

const deleteChurch = async (id:number) => {
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
}

export default  {
    getAllChurches,
    getChurchById,
    createChurch,
    updateChurch,
    deleteChurch,
}
