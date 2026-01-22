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
    return await MerriageRecordService.findAll();
}

const count = async (): Promise<number> => {
    return await MerriageRecordService.count();
}

const createMerriageRecord = async (merriageRecord: MerriageRecordData): Promise<MerriageRecordService> => {
    return await MerriageRecordService.create(merriageRecord);
}

export {
    getAllMerriageRecords,
    count,
    createMerriageRecord
}
