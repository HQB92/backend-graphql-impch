import {
    getAllMerriageRecords,
    count,
    createMerriageRecord,
    deleteMerriageRecord,
} from '../../services/merriageRecord.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversMerriageRecord = {
    MerriageRecordQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
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
        count: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('MerriageRecord - count');
            logger.logUser('MerriageRecord - count', context.user);
            logger.logArgs('MerriageRecord - count', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                const countMerriageRecords = await count();
                logger.logResponse('MerriageRecord - count', { dataValues: countMerriageRecords });
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
        create: async (parent: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('MerriageRecord - create');
            logger.logUser('MerriageRecord - create', context.user);
            logger.logArgs('MerriageRecord - create', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                // Los datos están en parent.merriageRecord (resultado del resolver padre)
                const merriageRecordData = parent?.merriageRecord || args?.merriageRecord;
                
                if (!merriageRecordData || !merriageRecordData.husbandId) {
                    throw new Error('merriageRecord is required');
                }
                
                const response = await createMerriageRecord(merriageRecordData);
                logger.logResponse('MerriageRecord - create', response);
                return {
                    code: 201,
                    message: 'Certificado de Matrimonio creado exitosamente',
                }
            } catch (error) {
                logger.logError('MerriageRecord - create', error);
                throw error;
            } finally {
                logger.logEnd('MerriageRecord - create');
            }
        },
        delete: async (parent: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('MerriageRecord - delete');
            logger.logUser('MerriageRecord - delete', context.user);
            logger.logArgs('MerriageRecord - delete', args);
            validateContext(context.user, 'MerriageRecord');
            try {
                // Los argumentos pueden estar en parent o en args
                const id = parent?.id || args?.id;
                
                if (!id) {
                    throw new Error('id is required');
                }
                const response = await deleteMerriageRecord(id);
                logger.logResponse('MerriageRecord - delete', response);
                return response;
            } catch (error) {
                logger.logError('MerriageRecord - delete', error);
                throw error;
            } finally {
                logger.logEnd('MerriageRecord - delete');
            }
        },
    },
};

export default resolversMerriageRecord;
