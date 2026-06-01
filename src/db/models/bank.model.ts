import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Church from './church.model';

interface BankAttributes {
    id: number;
    amount: number;
    date: Date;
    type?: string | null;
    churchId: number;
    userId: number;
    state: boolean;
    comment: string;
    deleted: boolean;
}

interface BankCreationAttributes extends Optional<BankAttributes, 'id' | 'type' | 'deleted'> {}

class Bank extends Model<BankAttributes, BankCreationAttributes> implements BankAttributes {
    public id!: number;
    public amount!: number;
    public date!: Date;
    public type?: string | null;
    public churchId!: number;
    public userId!: number;
    public state!: boolean;
    public comment!: string;
    public deleted!: boolean;
}

Bank.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    churchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Church,
            key: 'id'
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: 'Bank',
    tableName: 'Banks',
});

Bank.belongsTo(Church, { foreignKey: 'churchId', as: 'church' });
Church.hasMany(Bank, { foreignKey: 'churchId', as: 'Banks' });

export default Bank;
