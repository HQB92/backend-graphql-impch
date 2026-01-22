import bcrypt from 'bcryptjs';
import User from '../db/models/user.model';
import sequelize from '../config/database';

interface UserData {
    id?: number;
    username: string;
    password?: string;
    email: string;
    rut: string;
    roles: string[];
}

interface UpdateUserArgs {
    user: UserData;
}

export interface ServiceResponse {
    code: number;
    message: string;
}

const createUser = async (args: UserData): Promise<ServiceResponse> => {
    args.password = bcrypt.hashSync("123456", 10);
    const transaction = await sequelize.transaction();
    try {
        const { id, ...userData } = args;
        const user = await User.create(userData as any, { transaction });

        await transaction.commit();
        if (user) {
            return { code: 200, message: 'Usuario creado Exitosamente' };
        } else {
            return { code: 400, message: 'Error al crear usuario' };
        }

    } catch (error) {
        await transaction.rollback();
        return { code: 500, message: 'Error al crear usuario' };
    }
};

const findUserByUsername = async (username: string): Promise<User | null> => {
    return await User.findOne({ where: { username } });
};

const findUserById = async (id: number): Promise<User | null> => {
    return await User.findByPk(id);
}

const findAllUsers = async (): Promise<User[]> => {
    return await User.findAll({ order: [['id', 'ASC']] });
}

const updateUser = async (args: UpdateUserArgs): Promise<ServiceResponse> => {
    const { user } = args;

    const transaction = await sequelize.transaction();

    try {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
            await User.update(
                { password: user.password },
                { where: { id: user.id }, transaction }
            );
        }

        await User.update(
            { roles: user.roles, email: user.email },
            { where: { id: user.id }, transaction }
        );

        await transaction.commit();
        return { code: 200, message: 'Usuario Actualizado Exitosamente' };
    } catch (error) {
        await transaction.rollback();
        return { code: 400, message: 'Error al actualizar usuario' };
    }
};

const deleteUser = async (id: number): Promise<ServiceResponse> => {
    const transaction = await sequelize.transaction();
    try {
        const data = await User.destroy({ where: { id }, transaction });
        await transaction.commit();
        if (data === 1) {
            return { code: 200, message: 'Usuario Eliminado Exitosamente' };
        } else {
            return { code: 400, message: 'Error Usuario no existe' };
        }
    } catch (e) {
        await transaction.rollback();
        return { code: 500, message: 'Error al eliminar usuario' };
    }
}

const changePassword = async (id: number, password: string): Promise<ServiceResponse> => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const data = await User.update({ password: hashedPassword }, { where: { id } });
    if (data[0] === 1) {
        return { code: 200, message: 'Contraseña Cambiada Exitosamente' };
    } else {
        return { code: 400, message: 'Error al cambiar contraseña' };
    }
};

const resetPassword = async (id: number): Promise<ServiceResponse> => {
    const hashedPassword = bcrypt.hashSync('123456', 10);
    const data = await User.update({ password: hashedPassword }, { where: { id } });
    if (data[0] === 1) {
        return { code: 200, message: 'Contraseña Reseteada Exitosamente' };
    } else {
        return { code: 400, message: 'Error al resetear contraseña' };
    }
}

export {
    createUser,
    findUserByUsername,
    findUserById,
    findAllUsers,
    updateUser,
    deleteUser,
    changePassword,
    resetPassword
};
