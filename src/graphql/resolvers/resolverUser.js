const { findUserById, findAllUsers, createUser, updateUser, deleteUser, findUserByUsername, changePassword} = require('../../services/users');
const { validateContext } = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');

const resolversUser = {
    UserQuery: {
        getAll: async ( args, context) => {
            logger.logStart('User - getAll')
            logger.logUser('User - getAll', context.user);
            logger.logArgs('User - getAll', args);
            validateContext(context.user, 'User');
            try {
                const users = await findAllUsers();
                logger.logResponses('User - getAll', users);
                return users;
            }catch (error) {
                logger.logError('User - getAll', error);
                throw error;
            }finally {
                logger.logEnd('User - getAll');
            }
        },
        getById: async (args, context) => {
            logger.logStart('User - getById')
            logger.logUser('User - getById', context.user);
            logger.logArgs('User - getById', args);
            validateContext(context.user, 'User');
            try {
                const user = await findUserById(args.id);
                logger.logResponse('User - getById', user);
                return user;
            }catch (error) {
                logger.logError('User - getById', error);
                throw error;
            }finally {
                logger.logEnd('User - getById');
            }
        },
        geyByUsername: async ( args, context) => {
            logger.logStart('User - getByUsername')
            logger.logUser('User - getByUsername', context.user);
            logger.logArgs('User - getByUsername', args);
            validateContext(context.user, 'User');
            try {
                const user = await findUserByUsername(args.username);
                logger.logResponse('User - getByUsername', user);
                return user;
            }catch (error) {
                logger.logError('User - getByUsername', error);
                throw error;
            }finally {
                logger.logEnd('User - getByUsername');
            }
        }
    },

    UserMutation: {
        create: async ( args, context) => {
            logger.logStart('User - create')
            logger.logUser('User - create', context.user);
            logger.logArgs('User - create', args);
            validateContext(context.user, 'User');
            try {
                const user = await createUser(args);
                logger.logResponse('User - create', user);
                return user;
            }catch (error) {
                logger.logError('User - create', error);
                throw error;
            }finally {
                logger.logEnd('User - create');
            }
        },
        update: async ( args, context) => {
            logger.logStart('User - update')
            logger.logUser('User - update', context.user);
            logger.logArgs('User - update', args);
            validateContext(context.user, 'User');
            try {
                const user = await updateUser(args);
                logger.logResponse('User - update', user);
                return user;
            }catch (error) {
                logger.logError('User - update', error);
                throw error;
            }finally {
                logger.logEnd('User - update');
            }
        },
        delete: async (args, context) => {
            logger.logStart('User - delete')
            logger.logUser('User - delete', context.user);
            logger.logArgs('User - delete', args);
            validateContext(context.user, 'User');
            try {
                const user = await deleteUser(args.id);
                logger.logResponse('User - delete', user);
                return user;
            }catch (error) {
                logger.logError('User - delete', error);
                throw error;
            }finally {
                logger.logEnd('User - delete');
            }
        },
        changePassword: async (args, context) => {
            logger.logStart('User - changePassword')
            logger.logUser('User - changePassword', context.user);
            logger.logArgs('User - changePassword', args);
            validateContext(context.user, 'User');
            try {
                const response = await changePassword(args.id, args.password);
                logger.logResponse('User - changePassword', response);
                return response;
            }catch (error) {
                logger.logError('User - changePassword', error);
                throw error;
            }finally {
                logger.logEnd('User - changePassword');
            }
        }
    },
};

module.exports = resolversUser;