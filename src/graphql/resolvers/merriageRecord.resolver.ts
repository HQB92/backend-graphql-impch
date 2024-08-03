import {validateContext} from '../../utils/tokensLogs';
import {logger} from '../../utils/logger';
import MerriageService from '../../services/merriageRecord.service';

const resolversMerriageRecord = {
    MerriageRecordQuery: {
        getAll: async (args: any, context: any) => {
            logger.logStart('MerriageRecord - getAll');
            logger.logUser('MerriageRecord - getAll', context.user);
            logger.logArgs('MerriageRecord - getAll', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                const merriageRecords = await MerriageService.getAllMerriageRecords();
                logger.logResponses('MerriageRecord - getAll', merriageRecords);
                return merriageRecords;
            } catch (error) {
                logger.logError('MerriageRecord - getAll', error);
                throw error;
            } finally {
                logger.logEnd('MerriageRecord - getAll');
            }
        },
        count: async (args: any, context: any) => {
            logger.logStart('MerriageRecord - count');
            logger.logUser('MerriageRecord - count', context.user);
            logger.logArgs('MerriageRecord - count', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                const countMerriageRecords = await MerriageService.count();
                logger.logResponses('MerriageRecord - count', countMerriageRecords);
                return countMerriageRecords;
            } catch
                (error)
                {
                    logger.logError('MerriageRecord - count', error);
                    throw error;
                }
            finally
                {
                    logger.logEnd('MerriageRecord - count');
                }
            }
        },
        MerriageRecordMutation: {
            create: async (args: any, context: any) => {
                logger.logStart('MerriageRecord - create');
                logger.logUser('MerriageRecord - create', context.user);
                logger.logArgs('MerriageRecord - create', args);
                validateContext(context.user, 'MerriageRecord');
                try {
                    const response = await MerriageService.createMerriageRecord(args.merriageRecord);
                    logger.logResponse('MerriageRecord - create', response);
                    return {
                        code: 201,
                        message: 'MerriageRecord created successfully',
                    }
                } catch
                    (error)
                    {
                        logger.logError('MerriageRecord - create', error);
                        throw error;
                    }
                finally
                    {
                        logger.logEnd('MerriageRecord - create');
                    }
                }
            ,
                // update: async (args:any, context:any) => {
                //     logger.logStart('MerriageRecord - update');
                //     logger.logUser('MerriageRecord - update', context.user);
                //     logger.logArgs('MerriageRecord - update', args);
                //     validateContext(context.user, 'MerriageRecord');
                //     try {
                //         import { response = await updateStatus(args.merriageRecord);
                //         logger.logResponse('MerriageRecord - update', response);
                //         return response;
                //     } catch (error) {
                //         logger.logError('MerriageRecord - update', error);
                //         throw error;
                //     } finally {
                //         logger.logEnd('MerriageRecord - update');
                //     }
                // },
                // delete: async (args:any, context:any) => {
                //     logger.logStart('MerriageRecord - delete');
                //     logger.logUser('MerriageRecord - delete', context.user);
                //     logger.logArgs('MerriageRecord - delete', args);
                //     validateContext(context.user, 'MerriageRecord');
                //     try {
                //         import { response = await deleteStatus(args.id);
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

        export default resolversMerriageRecord;
