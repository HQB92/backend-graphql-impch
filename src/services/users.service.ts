import * as bcrypt from 'bcryptjs';
import User from '../db/models/user.model';
import sequelize from '../config/database';
import {Transaction} from "sequelize";


const createUser = async (args:any) => {
    args.password = bcrypt.hashSync("123456", 10);
    const  transaction = await sequelize.transaction();
    try {
        delete args.id;
        const user = await User.create(args, {transaction});

        await transaction.commit();
        if (user) {
            return {code: 200, message: 'Usuario creado Exitosamente'};
        } else {
            return {code: 400, message: 'Error al crear usuario'};
        }

    } catch (error) {
        await transaction.rollback();
        return {code: 500, message: 'Error al crear usuario'};
    }
};

const  findUserByUsername = async (username:string) => {
    return await User.findOne({where: {username}});
};

const findUserById = async (id:number) => {
    return await User.findOne({where: {id}});
}

const findAllUsers = async () => {
    return await User.findAll({order: [['id', 'ASC']]});
}

const  updateUser = async (args:any) => {
    const {user} = args;

    const transaction = await sequelize.transaction(); // Inicia una nueva transacción

    try {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
            await User.update(
                {password: user.password},
                {where: {id: user.id}, transaction}
            );
        }

        await User.update(
            {roles: user.roles, email: user.email},
            {where: {id: user.id}, transaction}
        );

        return {code: 200, message: 'Usuario Actualizado Exitosamente'};
    } catch (error) {
        await transaction.rollback();
        return {code: 400, message: 'Error al actualizar usuario'};
    }
};

const  deleteUser = async (id:number) => {
    const transaction:Transaction = await sequelize.transaction();
    try {
        const data = await User.destroy({ where: { id }, transaction });
        await transaction.commit();
        if (data === 1) {
            return {code: 200, message: 'Usuario Eliminado Exitosamente'};
        } else {
            return {code: 400, message: 'Error Usuario no existe'};
        }
    } catch (e) {
        await transaction.rollback();
        return {code: 500, message: 'Error al eliminar usuario'};
    }

}

const changePassword = async (id:number, password:string) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const transaction:Transaction = await sequelize.transaction();
    try {
        const data = await User.update(
            { password: hashedPassword },
            { where: { id }, transaction } // Incluir la transacción dentro del objeto de opciones
        );
        await transaction.commit();
        if (data[0] === 1) {
            return {code: 200, message: 'Contraseña Cambiada Exitosamente'};
        } else {
            return {code: 400, message: 'Error al cambiar contraseña'};
        }
    } catch (e) {
        await transaction.rollback();
        return {code: 500, message: 'Error al cambiar contraseña'};
    }
};

const resetPassword = async (id:number) => {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const transaction = await sequelize.transaction();
    try {
        const data = await User.update({password: hashedPassword}, {where: {id}, transaction});
        await transaction.commit();
        if (data[0] === 1) {
            return {code: 200, message: 'Contraseña Reseteada Exitosamente'};
        } else {
            return {code: 400, message: 'Error al resetear contraseña'};
        }
    } catch (e) {
        await transaction.rollback();
        return {code: 500, message: 'Error al resetear contraseña'};
    }
}

export default {
    createUser,
    findUserByUsername,
    findUserById,
    findAllUsers,
    updateUser,
    deleteUser,
    changePassword,
    resetPassword
};