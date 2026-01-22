import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Member from './member.model';

interface UserAttributes {
    id: number;
    rut: string;
    username: string;
    password: string;
    email: string;
    roles: string[];
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public rut!: string;
    public username!: string;
    public password!: string;
    public email!: string;
    public roles!: string[];
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rut: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    hooks: {
        afterCreate: async (user) => {
            await Member.update({ userId: user.id }, { where: { rut: user.rut } });
        }
    }
});

User.hasOne(Member, { foreignKey: 'userId', sourceKey: 'id' });
Member.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

export default User;
