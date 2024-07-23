const { findUserById, findAllUsers, createUser, updateUser, deleteUser, findUserByUsername, changePassword} = require('../../services/users');
const validateContext = require('../../utils/validateContext');
const resolversUser = {
    UserQuery: {
        getAll: async ( args, context) => {
            console.log('User - getAll - Inicio:', new Date().toISOString());
            console.log('User - getAll - User:', context.user);
            console.log('User - getAll - Args:', args);
            validateContext(context.user, "User");
            const users = await findAllUsers();
            users.forEach((user, index) => {
                console.log('Users - getAll - Respuesta[',index,'] :', user?.dataValues);

            });
            console.log('User - getAll - Fin:', new Date().toISOString());
        },
        getById: async (args, context) => {
            console.log('User - getById - Inicio:', new Date().toISOString());
            console.log('User - getById - User:', context.user);
            console.log('User - getById - Args:', args);
            validateContext(context.user, "User");
            const user = await findUserById(args.id);
            console.log('User - getById - Respuesta:', user);
            console.log('User - getById - Fin:', new Date().toISOString());
            return user;
        },
        geyByUsername: async ( args, context) => {
            console.log('User - getByUsername - Inicio:', new Date().toISOString());
            console.log('User - getByUsername - User:', context.user);
            console.log('User - getByUsername - Args:', args);
            validateContext(context.user, "User");
            const user = await findUserByUsername(args.username);
            console.log('User - getByUsername - Respuesta:', user);
            console.log('User - getByUsername - Fin:', new Date().toISOString());
        }
    },

    UserMutation: {
        create: async ( args, context) => {
            console.log('User - create - Inicio:', new Date().toISOString());
            console.log('User - create - User:', context.user);
            console.log('User - create - Args:', args);
            validateContext(context.user, "User");
            const { username, email, password, rut } = args;
            const user= await createUser(username, email, password, rut);
            console.log('User - create - Respuesta:', user);
            console.log('User - create - Fin:', new Date().toISOString());
        },
        update: async ( args, context) => {
            console.log('User - update - Inicio:', new Date().toISOString());
            console.log('User - update - User:', context.user);
            console.log('User - update - Args:', args);
            validateContext(context.user, "User");
            const {id, username, email, password, rut } = args;
            const user = await updateUser(id, username, email, password, rut);
            console.log('User - update - Respuesta:', user);
            console.log('User - update - Fin:', new Date().toISOString());
        },
        delete: async (args, context) => {
            console.log('User - delete - Inicio:', new Date().toISOString());
            console.log('User - delete - User:', context.user);
            console.log('User - delete - Args:', args);
            validateContext(context.user, "User");
            const user = await deleteUser(context.user.id);
            console.log('User - delete - Respuesta:', user);
            console.log('User - delete - Fin:', new Date().toISOString());
        },
        changePassword: async (args, context) => {
            console.log('User - changePassword - Inicio:', new Date().toISOString());
            console.log('User - changePassword - User:', context.user);
            console.log('User - changePassword - Args:', args);
            validateContext(context.user, "User");
            const { id, password } = args;
            const user= await changePassword(id, password);
            console.log('User - changePassword - Respuesta:', user);
            console.log('User - changePassword - Fin:', new Date().toISOString());
        }
    },
};

module.exports = resolversUser;