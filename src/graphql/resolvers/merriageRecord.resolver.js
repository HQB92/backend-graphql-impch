const {
    getAllMerriageRecords,
    count,
    createMerriageRecord,
} = require('../../services/merriageRecord.service');
const { validateContext } = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');

const resolversMerriageRecord = {
    MerriageRecordQuery: {
        getAll: async (args, context) => {
            logger.logStart('MerriageRecord - getAll');
            logger.logUser('MerriageRecord - getAll', context.user);
            logger.logArgs('MerriageRecord - getAll', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                const merriageRecords = await getAllMerriageRecords();
                logger.logResponses('MerriageRecord - getAll', merriageRecords);
                return merriageRecords;
            } catch (error) {
                logger.logError('MerriageRecord - getAll', error);
                throw error;
            } finally {
                logger.logEnd('MerriageRecord - getAll');
            }
        },
        count: async (args, context) => {
            logger.logStart('MerriageRecord - count');
            logger.logUser('MerriageRecord - count', context.user);
            logger.logArgs('MerriageRecord - count', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                const countMerriageRecords = await count();
                logger.logResponses('MerriageRecord - count', countMerriageRecords);
                return countMerriageRecords;
            } catch (error) {
                logger.logError('MerriageRecord - count', error);
                throw error;
            } finally {
                logger.logEnd('MerriageRecord - count');
            }
        }
    },
    MerriageRecordMutation: {
        create: async (args, context) => {
            logger.logStart('MerriageRecord - create');
            logger.logUser('MerriageRecord - create', context.user);
            logger.logArgs('MerriageRecord - create', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                const response = await createMerriageRecord(args.merriageRecord);
                logger.logResponse('MerriageRecord - create', response);
                return response;
            } catch (error) {
                logger.logError('MerriageRecord - create', error);
                throw error;
            } finally {
                logger.logEnd('MerriageRecord - create');
            }
        },
        // update: async (args, context) => {
        //     logger.logStart('MerriageRecord - update');
        //     logger.logUser('MerriageRecord - update', context.user);
        //     logger.logArgs('MerriageRecord - update', args);
        //     validateContext(context.user, 'MerriageRecord');
        //     try {
        //         const response = await updateStatus(args.merriageRecord);
        //         logger.logResponse('MerriageRecord - update', response);
        //         return response;
        //     } catch (error) {
        //         logger.logError('MerriageRecord - update', error);
        //         throw error;
        //     } finally {
        //         logger.logEnd('MerriageRecord - update');
        //     }
        // },
        // delete: async (args, context) => {
        //     logger.logStart('MerriageRecord - delete');
        //     logger.logUser('MerriageRecord - delete', context.user);
        //     logger.logArgs('MerriageRecord - delete', args);
        //     validateContext(context.user, 'MerriageRecord');
        //     try {
        //         const response = await deleteStatus(args.id);
        //         logger.logResponse('MerriageRecord - delete', response);
        //         return response;
        //     } catch (error) {
        //         logger.logError('MerriageRecord - delete', error);
        //         throw error;
        //     } finally {
        //         logger.logEnd('MerriageRecord - delete');
        //     }
        // }
    },

};

module.exports = resolversMerriageRecord;
