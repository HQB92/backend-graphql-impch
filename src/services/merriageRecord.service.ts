import MerriageRecordService from '../db/models/merriageRecord.model';

interface MerriageRecordData {
    husbandId: string;
    fullNameHusband: string;
    wifeId: string;
    fullNameWife: string;
    civilCode: number;
    civilDate: Date;
    civilPlace: string;
    religiousDate: Date;
}

const getAllMerriageRecords = async (): Promise<MerriageRecordService[]> => {
    return await MerriageRecordService.findAll({
        where: { deleted: false },
        order: [['id', 'DESC']]
    });
}

const count = async (): Promise<number> => {
    return await MerriageRecordService.count({ where: { deleted: false } });
}

const createMerriageRecord = async (merriageRecord: MerriageRecordData): Promise<MerriageRecordService> => {
    return await MerriageRecordService.create(merriageRecord);
}

const deleteMerriageRecord = async (id: string): Promise<{ code: number; message: string }> => {
    try {
        const [updatedRows] = await MerriageRecordService.update(
            { deleted: true },
            { where: { id: parseInt(id), deleted: false } }
        );

        if (updatedRows === 0) {
            return {
                code: 404,
                message: 'Registro de matrimonio no encontrado',
            };
        }

        return {
            code: 200,
            message: 'Registro de matrimonio eliminado exitosamente',
        };
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error interno del servidor al eliminar el registro de matrimonio',
        };
    }
}

export {
    getAllMerriageRecords,
    count,
    createMerriageRecord,
    deleteMerriageRecord
}
