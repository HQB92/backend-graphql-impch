const bcrypt = require('bcryptjs');
const User = require('../db/models/user');
const Member = require('../db/models/member');
const sequelize = require('../config/database');

// Crear un usuario (usado para pruebas)
const createUser = async (args) => {
    args.password = bcrypt.hashSync("123456", 10);
    const transaction = await sequelize.transaction();

    try {
        const member = await Member.findOne({ where: { rut: args.rut } }, transaction);
        if (!member) {
            return { code: 403, message: 'Miembro no existe' };
        }

        delete args.id;
        const user = await User.create(args,transaction);
        const meberUpdate = await Member.update({ userId: user.dataValues.id }, { where: { rut: args.rut } }, transaction);
        if ( user && meberUpdate[0] === 1) {
            return {code: 200, message: 'Usuario creado Exitosamente'};
        } else {
            return {code: 400, message: 'Error al crear usuario'};
        }
    } catch (error) {
        await transaction.rollback();
        return {code: 500, message: 'Error al crear usuario'};
    }
};

// Buscar un usuario por nombre de usuario
const findUserByUsername = async (username) => {
    return await User.findOne({ where: { username } });
};

const findUserById = async (id) => {
    return await User.findOne(id);
}

const findAllUsers = async () => {
    return await User.findAll({ order: [['id', 'ASC']] });
}

const updateUser = async (args) => {
    const { user } = args;

    const transaction = await sequelize.transaction(); // Inicia una nueva transacción

    try {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
            // Actualiza el usuario con la nueva contraseña
            await User.update(
                { password: user.password },
                { where: { id: user.id }, transaction }
            );
        }

        // Actualiza el usuario con roles y email
        await User.update(
            { roles: user.roles, email: user.email },
            { where: { id: user.id }, transaction }
        );



        return { code: 200, message: 'Usuario Actualizado Exitosamente' };
    } catch (error) {
        // Revierte la transacción en caso de error
        await transaction.rollback();
        return { code: 400, message: 'Error al actualizar usuario' };
    }
};

const deleteUser = async (id) => {
    const transaction = await sequelize.transaction();
    try {
        const data = await User.destroy({ where: { id } }, transaction );
        await transaction.commit();
        if (data === 1) {
            return { code: 200 , message: 'Usuario Eliminado Exitosamente' };
        }else {
            return {code: 400, message: 'Error Usuario no existe'};
        }
    } catch (e) {
        await transaction.rollback();
        return {code: 500, message: 'Error al eliminar usuario'};
    }

}

const changePassword = async (id, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const data = await User.update({ password: hashedPassword }, { where: { id } });
    if (data[0] === 1) {
        return { code: 200 , message: 'Contraseña Cambiada Exitosamente' };
    }else {
        return { code: 400 , message: 'Error al cambiar contraseña' };
    }
};

const resetPassword = async (id) => {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const data = await User.update({ password: hashedPassword }, { where: { id } });
    if (data[0] === 1) {
        return { code: 200 , message: 'Contraseña Reseteada Exitosamente' };
    }else {
        return { code: 400 , message: 'Error al resetear contraseña' };
    }

}

module.exports = { createUser,
                   findUserByUsername,
                   findUserById,
                   findAllUsers,
                   updateUser,
                   deleteUser,
                   changePassword,
                   resetPassword
                };