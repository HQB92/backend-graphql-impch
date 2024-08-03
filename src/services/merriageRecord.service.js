// src/service/statusService.js
const merriageRecordService = require('../db/models/merriageRecord.model');

const getAllMerriageRecords = async () => {
    return await merriageRecordService.findAll();
}

const count = async () => {
    return await merriageRecordService.count();
}

const createMerriageRecord = async (merriageRecord) => {
    return await merriageRecordService.create(merriageRecord);
}

module.exports = {
    getAllMerriageRecords,
    count,
    createMerriageRecord
}

