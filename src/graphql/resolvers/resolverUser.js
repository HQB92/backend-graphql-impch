const { findUserById, findAllUsers, createUser, updateUser, deleteUser, findUserByUsername, changePassword} = require('../../services/users');
const validateContext = require('../../utils/validateContext');
const resolversUser = {
    UserQuery: {
        getAll: async ( args, context) => {
            console.log('getAll - Inicio:', new Date().toISOString());
            console.log('getAll - Args:', args);
            validateContext(context.user);
            const users = await findAllUsers();
            console.log('getAll - Respuesta:', users);
            console.log('getAll - Fin:', new Date().toISOString());
        },
        getById: async (args, context) => {
            console.log('getById - Inicio:', new Date().toISOString());
            console.log('getById - Args:', args);
            validateContext(context.user);
            const user = await findUserById(args.id);
            console.log('getById - Respuesta:', user);
            console.log('getById - Fin:', new Date().toISOString());
            return user;
        },
        geyByUsername: async ( args, context) => {
            console.log('getByUsername - Inicio:', new Date().toISOString());
            console.log('getByUsername - Args:', args);
            validateContext(context.user);
            const user = await findUserByUsername(args.username);
            console.log('getByUsername - Respuesta:', user);
            console.log('getByUsername - Fin:', new Date().toISOString());
        }
    },

    UserMutation: {
        create: async ( args, context) => {
            console.log('create - Inicio:', new Date().toISOString());
            console.log('create - Args:', args);
            validateContext(context.user);
            const { username, email, password, rut } = args;
            const user= await createUser(username, email, password, rut);
            console.log('create - Respuesta:', user);
            console.log('create - Fin:', new Date().toISOString());
        },
        update: async ( args, context) => {
            console.log('update - Inicio:', new Date().toISOString());
            console.log('update - Args:', args);
            validateContext(context.user);
            const {id, username, email, password, rut } = args;
            const user = await updateUser(id, username, email, password, rut);
            console.log('update - Respuesta:', user);
            console.log('update - Fin:', new Date().toISOString());
        },
        delete: async (args, context) => {
            console.log('delete - Inicio:', new Date().toISOString());
            console.log('delete - Args:', args);
            validateContext(context.user);
            const user = await deleteUser(context.user.id);
            console.log('delete - Respuesta:', user);
            console.log('delete - Fin:', new Date().toISOString());
        },
        changePassword: async (args, context) => {
            console.log('changePassword - Inicio:', new Date().toISOString());
            console.log('changePassword - Args:', args);
            validateContext(context.user);
            const { id, password } = args;
            const user= await changePassword(id, password);
            console.log('changePassword - Respuesta:', user);
            console.log('changePassword - Fin:', new Date().toISOString());
        }
    },
};

module.exports = resolversUser;