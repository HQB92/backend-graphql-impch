import * as Users from '../../services/users.service';
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext, GraphQLArgs } from '../types';

const resolversUser = {
    UserQuery: {
        getAll: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - getAll')
            console.log('[User.getAll] Full context:', JSON.stringify(context, null, 2));
            console.log('[User.getAll] context.user:', context.user);
            console.log('[User.getAll] context type:', typeof context);
            console.log('[User.getAll] context keys:', Object.keys(context || {}));
            logger.logUser('User - getAll', context.user);
            logger.logArgs('User - getAll', args);
            validateContext(context.user, 'User');
            try {
                const users = await Users.findAllUsers();
                logger.logResponses('User - getAll', users);
                return users;
            } catch (error) {
                logger.logError('User - getAll', error);
                throw error;
            } finally {
                logger.logEnd('User - getAll');
            }
        },
        getById: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - getById')
            logger.logUser('User - getById', context.user);
            logger.logArgs('User - getById', args);
            validateContext(context.user, 'User');
            try {
                const user = await Users.findUserById(args.id!);
                logger.logResponse('User - getById', user);
                return user;
            } catch (error) {
                logger.logError('User - getById', error);
                throw error;
            } finally {
                logger.logEnd('User - getById');
            }
        },
        geyByUsername: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - getByUsername')
            logger.logUser('User - getByUsername', context.user);
            logger.logArgs('User - getByUsername', args);
            validateContext(context.user, 'User');
            try {
                const user = await Users.findUserByUsername(args.username!);
                logger.logResponse('User - getByUsername', user);
                return user;
            } catch (error) {
                logger.logError('User - getByUsername', error);
                throw error;
            } finally {
                logger.logEnd('User - getByUsername');
            }
        }
    },

    UserMutation: {
        create: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - create')
            logger.logUser('User - create', context.user);
            logger.logArgs('User - create', args);
            validateContext(context.user, 'User');
            try {
                const user = await Users.createUser(args.user);
                logger.logResponse('User - create', user);
                return user;
            } catch (error) {
                logger.logError('User - create', error);
                return {
                    code: 500,
                    message: 'Error al actualizar miembro',
                }
            } finally {
                logger.logEnd('User - create');
            }
        },
        update: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - update')
            logger.logUser('User - update', context.user);
            logger.logArgs('User - update', args);
            validateContext(context.user, 'User');
            try {
                const user = await Users.updateUser({ user: args.user! });
                logger.logResponse('User - update', user);
                return user;
            } catch (error) {
                logger.logError('User - update', error);
                throw error;
            } finally {
                logger.logEnd('User - update');
            }
        },
        delete: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - delete')
            logger.logUser('User - delete', context.user);
            logger.logArgs('User - delete', args);
            validateContext(context.user, 'User');
            try {
                const user = await Users.deleteUser(args.id!);
                logger.logResponse('User - delete', user);
                return user;
            } catch (error) {
                logger.logError('User - delete', error);
                throw error;
            } finally {
                logger.logEnd('User - delete');
            }
        },
        changePassword: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - changePassword')
            logger.logUser('User - changePassword', context.user);
            logger.logArgs('User - changePassword', args);
            validateContext(context.user, 'User');
            try {
                const response = await Users.changePassword(args.id!, args.password!);
                logger.logResponse('User - changePassword', response);
                return response;
            } catch (error) {
                logger.logError('User - changePassword', error);
                throw error;
            } finally {
                logger.logEnd('User - changePassword');
            }
        },
        resetPassword: async (_: any, args: GraphQLArgs, context: GraphQLContext) => {
            logger.logStart('User - resetPassword')
            logger.logUser('User -  resetPassword', context.user);
            logger.logArgs('User - resetPassword', args);
            validateContext(context.user, 'User');
            try {
                const response = await Users.resetPassword(args.id!);
                logger.logResponse('User - resetPassword', response);
                return response;
            } catch (error) {
                logger.logError('User - resetPassword', error);
                throw error;
            } finally {
                logger.logEnd('User - resetPassword');
            }
        }
    },
};

export default resolversUser;
