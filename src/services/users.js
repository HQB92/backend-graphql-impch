const bcrypt = require('bcryptjs');
const User = require('../db/models/user');

// Crear un usuario (usado para pruebas)
const createUser = async (username, password, email) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return await User.create({ username, password: hashedPassword, email });
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

const updateUser = async (id, username, email, password, rut) => {
    if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return await User.update(
            { username,
              email,
              rut,
              password: hashedPassword
            }, { where: { id } });
    }
    return await User.update(
        { username, email, rut }, { where: { id } });

}

const deleteUser = async (id) => {
    const data = await User.destroy({ where: { id } });
    if (data === 1) {
        return { code: 200 , message: 'Usuario Eliminado Exitosamente' };
    }else {
        return {code: 400, message: 'Error al eliminar usuario'};
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