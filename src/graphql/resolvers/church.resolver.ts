import * as churchService from '../../services/church.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversChurch = {
    ChurchQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Church - getAll')
            logger.logUser('Church - getAll', context.user);
            logger.logArgs('Church - getAll', args);
            validateContext(context.user, 'Church');
            try {
                const churches = await churchService.getAllChurches();
                logger.logResponses('Church - getAll', churches);
                return churches;
            } catch (error) {
                logger.logError('Church - getAll', error);
                throw error;
            } finally {
                logger.logEnd('Church - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Church - getById')
            logger.logUser('Church - getById', context.user);
            logger.logArgs('Church - getById', args);
            validateContext(context.user, 'Church');
            try {
                const church = await churchService.getChurchById(args.id!);
                logger.logResponse('Church - getById', church);
                return church;
            } catch (error) {
                logger.logError('Church - getById', error);
                throw error;
            } finally {
                logger.logEnd('Church - getById');
            }
        },
    },

    ChurchMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Church - create')
            logger.logUser('Church - create', context.user);
            logger.logArgs('Church - create', args);
            validateContext(context.user, 'Church');
            try {
                const response = await churchService.createChurch({
                    name: args.name as string,
                    address: args.address as string,
                    distanceToMotherTemple: args.distanceToMotherTemple as string | undefined,
                    pastor: args.pastor as string | undefined,
                    landlinePhone: args.landlinePhone as string | undefined,
                    mobilePhone: args.mobilePhone as string | undefined,
                    capacity: args.capacity as string | undefined,
                    sectorNumber: args.sectorNumber as string | undefined,
                });
                logger.logResponse('Church - create', response);
                return response;
            } catch (error) {
                logger.logError('Church - create', error);
                throw error;
            } finally {
                logger.logEnd('Church - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Church - update')
            logger.logUser('Church - update', context.user);
            logger.logArgs('Church - update', args);
            validateContext(context.user, 'Church');
            try {
                const updateData: any = { id: Number(args.id) };
                if (args.name !== undefined) updateData.name = args.name as string;
                if (args.address !== undefined) updateData.address = args.address as string;
                if (args.distanceToMotherTemple !== undefined) updateData.distanceToMotherTemple = args.distanceToMotherTemple as string;
                if (args.pastor !== undefined) updateData.pastor = args.pastor as string;
                if (args.landlinePhone !== undefined) updateData.landlinePhone = args.landlinePhone as string;
                if (args.mobilePhone !== undefined) updateData.mobilePhone = args.mobilePhone as string;
                if (args.capacity !== undefined) updateData.capacity = args.capacity as string;
                if (args.sectorNumber !== undefined) updateData.sectorNumber = args.sectorNumber as string;
                
                const response = await churchService.updateChurch(updateData);
                logger.logResponse('Church - update', response);
                return response;
            } catch (error) {
                logger.logError('Church - update', error);
                throw error;
            } finally {
                logger.logEnd('Church - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('Church - delete')
            logger.logUser('Church - delete', context.user);
            logger.logArgs('Church - delete', args);
            validateContext(context.user, 'Church');
            try {
                const response = await churchService.deleteChurch(args.id!);
                logger.logResponse('Church - delete', response);
                return response;
            } catch (error) {
                logger.logError('Church - delete', error);
                throw error;
            } finally {
                logger.logEnd('Church - delete');
            }
        },
    },
};

export default resolversChurch;
