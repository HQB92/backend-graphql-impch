const { findUserById, findAllUsers, createUser, updateUser, deleteUser, findUserByUsername, changePassword} = require('../../services/users');

const resolversUser = {
    UserQuery: {
        getAll: async ( args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            console.log('context', context.user);
            return await findAllUsers();
        },
        getById: async (args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            return await findUserById(args.id);
        },
        geyByUsername: async ( args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            return await findUserByUsername(args.username);
        }
    },

    UserMutation: {
        create: async ( args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            const { username, email, password, rut } = args;
            return await createUser(username, email, password, rut);
        },
        update: async ( args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            const {id, username, email, password, rut } = args;
            console.log('args', args);
            return await updateUser(id, username, email, password, rut);
        },
        delete: async (args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            return await deleteUser(context.user.id);
        },
        changePassword: async (args, context) => {
            if (!context.user) {
                throw new Error('You are not authenticated!');
            }
            const { id, password } = args;
            return await changePassword(id, password);
        }
    },
};

module.exports = resolversUser;