// src/service/statusService.js
import  Status from '../db/models/status.model';

const getAllStatuses = async () => {
    return await Status.findAll();
};

const getStatusById = async (id:any) => {
    return await Status.findOne({ where: { id } });
};

const createStatus = async (statusData:any) => {
    const  {name} = statusData;
    const existingStatus = await Status.findOne({where: {name}});
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

const  updateStatus = async (statusData:any) => {
    const {id} = statusData;
    await Status.update(statusData, {where: {id}});
    return {
        code: 200,
        message: 'Estado actualizado Exitosamente',
    };
};

const deleteStatus = async (id:number) => {
    const result = await Status.destroy({where: {id}});
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

export default {
    getAllStatuses,
    getStatusById,
    createStatus,
    updateStatus,
    deleteStatus,
};
