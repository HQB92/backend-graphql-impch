const { findUserById, findAllUsers, createUser, updateUser, deleteUser, findUserByUsername, changePassword, resetPassword} = require('../../services/users');
const { validateContext } = require('../../utils/tokensLogs');
const logger = require('../../utils/logger');
const { getMemberByRut, updateMember } = require('../../services/member');
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
                logger.logStart('Member - getByRut')
                logger.logUser('Member - getByRut', context.user);
                logger.logArgs('Member - getByRut', args);
                validateContext(context.user, 'Member');
                getMemberByRut(args.rut).then(member => {
                    logger.logResponse('Member - getByRut', member);
                    member.user = user.id;
                    updateMember(member).then(member => {
                        logger.logStart('Member - update')
                        logger.logUser('Member - update', context.user);
                        logger.logArgs('Member - update', args);
                        validateContext(context.user, 'Member');
                        logger.logResponse('Member - update', member);

                    }).catch(error => {
                        logger.logError('Member - update', error);
                        throw error;
                    }).finally(() => {
                        logger.logEnd('Member - update');
                    })
                }).finally(() => {
                    logger.logEnd('Member - getByRut');
                });
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
                const user = await updateUser(args.user);
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
        },
        resetPassword: async (args, context) => {
            logger.logStart('User - resetPassword')
            logger.logUser('User -  resetPassword', context.user);
            logger.logArgs('User - resetPassword', args);
            validateContext(context.user, 'User');
            try {
                const response = await resetPassword(args.id);
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
module.exports = resolversUser;