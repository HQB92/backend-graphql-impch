import * as rehearsalService from '../../services/rehearsal.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversRehearsal = {
    RehearsalQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Rehearsal - getAll');
            logger.logUser('Rehearsal - getAll', context.user);
            logger.logArgs('Rehearsal - getAll', args);
            validateContext(context.user, 'Rehearsal');
            try {
                const rehearsals = await rehearsalService.getAllRehearsals();
                logger.logResponses('Rehearsal - getAll', rehearsals);
                return rehearsals;
            } catch (error) {
                logger.logError('Rehearsal - getAll', error);
                throw error;
            } finally {
                logger.logEnd('Rehearsal - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Rehearsal - getById');
            logger.logUser('Rehearsal - getById', context.user);
            logger.logArgs('Rehearsal - getById', args);
            validateContext(context.user, 'Rehearsal');
            try {
                const rehearsal = await rehearsalService.getRehearsalById(Number(args.id!));
                logger.logResponse('Rehearsal - getById', rehearsal);
                return rehearsal;
            } catch (error) {
                logger.logError('Rehearsal - getById', error);
                throw error;
            } finally {
                logger.logEnd('Rehearsal - getById');
            }
        },
        getAttendanceStats: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Rehearsal - getAttendanceStats');
            logger.logUser('Rehearsal - getAttendanceStats', context.user);
            logger.logArgs('Rehearsal - getAttendanceStats', args);
            validateContext(context.user, 'Rehearsal');
            try {
                const stats = await rehearsalService.getRehearsalAttendanceStats(Number(args.rehearsalId!));
                logger.logResponse('Rehearsal - getAttendanceStats', stats);
                return stats;
            } catch (error) {
                logger.logError('Rehearsal - getAttendanceStats', error);
                throw error;
            } finally {
                logger.logEnd('Rehearsal - getAttendanceStats');
            }
        },
    },

    RehearsalMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Rehearsal - create');
            logger.logUser('Rehearsal - create', context.user);
            logger.logArgs('Rehearsal - create', args);
            validateContext(context.user, 'Rehearsal');
            try {
                const rehearsalData = args.rehearsal as any;
                const response = await rehearsalService.createRehearsal({
                    date: new Date(rehearsalData.date),
                    description: rehearsalData.description || null,
                    churchId: rehearsalData.churchId ? Number(rehearsalData.churchId) : null,
                });
                logger.logResponse('Rehearsal - create', response);
                return response;
            } catch (error) {
                logger.logError('Rehearsal - create', error);
                throw error;
            } finally {
                logger.logEnd('Rehearsal - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Rehearsal - update');
            logger.logUser('Rehearsal - update', context.user);
            logger.logArgs('Rehearsal - update', args);
            validateContext(context.user, 'Rehearsal');
            try {
                const rehearsalData = args.rehearsal as any;
                const updateData: any = {
                    id: rehearsalData.id ? Number(rehearsalData.id) : undefined,
                };
                if (rehearsalData.date !== undefined && rehearsalData.date !== null) {
                    updateData.date = new Date(rehearsalData.date);
                }
                if (rehearsalData.description !== undefined) {
                    updateData.description = rehearsalData.description || null;
                }
                if (rehearsalData.churchId !== undefined) {
                    updateData.churchId = rehearsalData.churchId ? Number(rehearsalData.churchId) : null;
                }
                const response = await rehearsalService.updateRehearsal(updateData);
                logger.logResponse('Rehearsal - update', response);
                return response;
            } catch (error) {
                logger.logError('Rehearsal - update', error);
                throw error;
            } finally {
                logger.logEnd('Rehearsal - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Rehearsal - delete');
            logger.logUser('Rehearsal - delete', context.user);
            logger.logArgs('Rehearsal - delete', args);
            validateContext(context.user, 'Rehearsal');
            try {
                const response = await rehearsalService.deleteRehearsal(Number(args.id!));
                logger.logResponse('Rehearsal - delete', response);
                return response;
            } catch (error) {
                logger.logError('Rehearsal - delete', error);
                throw error;
            } finally {
                logger.logEnd('Rehearsal - delete');
            }
        },
    },
};

export default resolversRehearsal;
