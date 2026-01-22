import ChurchModel from '../db/models/church.model';

interface ChurchData {
    id?: number;
    name: string;
    address?: string;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const getAllChurches = async (): Promise<ChurchModel[]> => {
    return await ChurchModel.findAll();
};

const getChurchById = async (id: number): Promise<ChurchModel | null> => {
    return await ChurchModel.findByPk(id);
};

const createChurch = async (churchData: ChurchData): Promise<ServiceResponse> => {
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

const updateChurch = async (churchData: ChurchData): Promise<ServiceResponse> => {
    const { id } = churchData;
    if (!id) {
        return {
            code: 400,
            message: 'ID es requerido',
        };
    }
    await ChurchModel.update(churchData, { where: { id } });
    return {
        code: 200,
        message: 'Iglesia actualizada Exitosamente',
    };
};

const deleteChurch = async (id: number): Promise<ServiceResponse> => {
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

export {
    getAllChurches,
    getChurchById,
    createChurch,
    updateChurch,
    deleteChurch,
};
