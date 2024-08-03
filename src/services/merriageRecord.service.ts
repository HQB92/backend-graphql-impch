// src/service/statusService.js
import  merriageRecordService from '../db/models/merriageRecord.model';

const getAllMerriageRecords = async () => {
    return await merriageRecordService.findAll();
}

const  count = async () => {
    return await merriageRecordService.count();
}

const  createMerriageRecord = async (merriageRecord:any) => {
    return await merriageRecordService.create(merriageRecord);
}

export default {
    getAllMerriageRecords,
    count,
    createMerriageRecord
}

