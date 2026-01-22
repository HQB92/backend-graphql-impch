import StatusService from '../db/models/status.model';

interface StatusData {
    id?: number;
    name: string;
    description: string;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const getAllStatuses = async (): Promise<StatusService[]> => {
    return await StatusService.findAll();
};

const getStatusById = async (id: number): Promise<StatusService | null> => {
    return await StatusService.findByPk(id);
};

const createStatus = async (statusData: StatusData): Promise<ServiceResponse> => {
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

const updateStatus = async (statusData: StatusData): Promise<ServiceResponse> => {
    const { id } = statusData;
    if (!id) {
        return {
            code: 400,
            message: 'ID es requerido',
        };
    }
    await StatusService.update(statusData, { where: { id } });
    return {
        code: 200,
        message: 'Estado actualizado Exitosamente',
    };
};

const deleteStatus = async (id: number): Promise<ServiceResponse> => {
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

export {
    getAllStatuses,
    getStatusById,
    createStatus,
    updateStatus,
    deleteStatus,
};
