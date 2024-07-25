const bcrypt = require('bcryptjs');
const User = require('../db/models/user');
const Member = require('../db/models/member');

// Crear un usuario (usado para pruebas)
const createUser = async (args) => {
    args.password = bcrypt.hashSync("123456", 10);
    const member = await Member.findOne({ where: { rut: args.rut } });
    if (!member) {
        return { code: 403, message: 'Miembro no existe' };
    }
    delete args.id;
    const user = await User.create(args);
    const meberUpdate = await Member.update({ userId: user.dataValues.id }, { where: { rut: args.rut } });
    if ( user && meberUpdate[0] === 1) {
        return {code: 200, message: 'Usuario creado Exitosamente'};
    } else {
        return {code: 400, message: 'Error al crear usuario'};
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
    const {user} = args
    if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
        try {
            const userData = await User.update(
                { password:user.password }, {where: {id: user.id}});
            console.log(userData);
            return {code: 200, message: 'Usuario Actualizado Exitosamente'};
        }catch (error) {
            console.log(error);
            return {code: 400, message: 'Error al actualizar usuario'};
        }
    }
    try {
        const userData = await User.update(
            { roles:user.roles, email:user.email }, {where: {id: user.id}});
        console.log(userData);
        return {code: 200, message: 'Usuario Actualizado Exitosamente'};
    } catch (error) {
        console.log(error);
        return {code: 400, message: 'Error al actualizar usuario'};
    }

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