import BaptismRecordService from'../db/models/baptismRecord.model';

const  getAllBaptismRecords = async () => {
    return await BaptismRecordService.findAll({order: [['baptismDate', 'DESC']]});
};

const getBaptismRecordById = async (id:number) => {
    return await BaptismRecordService.findByPk(id);
};

const createBaptismRecord = async (baptismRecordData:any) => {
    const {childRUT}  = baptismRecordData;
    const existingRecord = await BaptismRecordService.findOne({ where: { childRUT } });
    if (existingRecord) {
        return {
            code: 400,
            message: 'Registro de bautizo ya existe',
        };
    }
    await BaptismRecordService.create(baptismRecordData);
    return {
        code: 200,
        message: 'Registro de bautizo creado Exitosamente',
    };
};

const updateBaptismRecord = async (baptismRecordData:any) => {
    const  { id } = baptismRecordData;
    await BaptismRecordService.update(baptismRecordData, { where: { id } });
    return {
        code: 200,
        message: 'Registro de bautizo actualizado Exitosamente',
    };
};

const deleteBaptismRecord = async (id:number) => {
    const result = await BaptismRecordService.destroy({ where: { id } });
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

export default {
    getAllBaptismRecords,
    getBaptismRecordById,
    createBaptismRecord,
    updateBaptismRecord,
    deleteBaptismRecord,
};
