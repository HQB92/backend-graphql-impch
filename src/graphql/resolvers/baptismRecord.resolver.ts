import * as baptismRecordService from '../../services/baptismRecord.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversBaptismRecord = {
    BaptismRecordQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('BaptismRecord - getAll')
            logger.logUser('BaptismRecord - getAll', context.user);
            logger.logArgs('BaptismRecord - getAll', args);
            validateContext(context.user, 'BaptismRecord');
            try {
                const baptismRecords = await baptismRecordService.getAllBaptismRecords();
                logger.logResponses('BaptismRecord - getAll', baptismRecords);
                return baptismRecords;
            } catch (error) {
                logger.logError('BaptismRecord - getAll', error);
                throw error;
            } finally {
                logger.logEnd('BaptismRecord - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('BaptismRecord - getById')
            logger.logUser('BaptismRecord - getById', context.user);
            logger.logArgs('BaptismRecord - getById', args);
            validateContext(context.user, 'BaptismRecord');
            try {
                const baptismRecord = await baptismRecordService.getBaptismRecordById(args.id!);
                logger.logResponse('BaptismRecord - getById', baptismRecord);
                return baptismRecord;
            } catch (error) {
                logger.logError('BaptismRecord - getById', error);
                throw error;
            } finally {
                logger.logEnd('BaptismRecord - getById');
            }
        },
        getByChildRUT: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('BaptismRecord - getByChildRUT')
            logger.logUser('BaptismRecord - getByChildRUT', context.user);
            logger.logArgs('BaptismRecord - getByChildRUT', args);
            validateContext(context.user, 'BaptismRecord');
            try {
                const baptismRecord = await baptismRecordService.getBaptismRecordByChildRUT(args.childRUT!);
                logger.logResponse('BaptismRecord - getByChildRUT', baptismRecord);
                return baptismRecord;
            } catch (error) {
                logger.logError('BaptismRecord - getByChildRUT', error);
                throw error;
            } finally {
                logger.logEnd('BaptismRecord - getByChildRUT');
            }
        },
    },

    BaptismRecordMutation: {
        create: async (parent: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('BaptismRecord - create')
            logger.logUser('BaptismRecord - create', context.user);
            logger.logArgs('BaptismRecord - create', args);
            validateContext(context.user, 'BaptismRecord');
            try {
                // Los datos están en parent.baptismRecord (resultado del resolver padre)
                const baptismRecordData = parent?.baptismRecord || args?.baptismRecord;
                
                if (!baptismRecordData || !baptismRecordData.childRUT) {
                    throw new Error('baptismRecord is required');
                }
                
                const response = await baptismRecordService.createBaptismRecord(baptismRecordData);
                logger.logResponse('BaptismRecord - create', response);
                return response;
            } catch (error) {
                logger.logError('BaptismRecord - create', error);
                throw error;
            } finally {
                logger.logEnd('BaptismRecord - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('BaptismRecord - update')
            logger.logUser('BaptismRecord - update', context.user);
            logger.logArgs('BaptismRecord - update', args);
            validateContext(context.user, 'BaptismRecord');
            try {
                const response = await baptismRecordService.updateBaptismRecord(args.baptismRecord);
                logger.logResponse('BaptismRecord - update', response);
                return response;
            } catch (error) {
                logger.logError('BaptismRecord - update', error);
                throw error;
            } finally {
                logger.logEnd('BaptismRecord - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('BaptismRecord - delete')
            logger.logUser('BaptismRecord - delete', context.user);
            logger.logArgs('BaptismRecord - delete', args);
            validateContext(context.user, 'BaptismRecord');
            try {
                const response = await baptismRecordService.deleteBaptismRecord(args.childRUT!);
                logger.logResponse('BaptismRecord - delete', response);
                return response;
            } catch (error) {
                logger.logError('BaptismRecord - delete', error);
                throw error;
            } finally {
                logger.logEnd('BaptismRecord - delete');
            }
        },
    },
};

export default resolversBaptismRecord;
