import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Church from './church.model';

interface ExpenseAttributes {
    id: number;
    amount: number;
    date: Date;
    type?: string | null;
    description?: string | null;
    source: string; // 'CAJA' | 'BANCO'
    churchId: number;
    userId: number;
    deleted: boolean;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'type' | 'description' | 'deleted'> {}

class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
    public id!: number;
    public amount!: number;
    public date!: Date;
    public type?: string | null;
    public description?: string | null;
    public source!: string;
    public churchId!: number;
    public userId!: number;
    public deleted!: boolean;
}

Expense.init({
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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'CAJA'
    },
    churchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Church, key: 'id' },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: 'Expense',
    tableName: 'Expenses',
});

Expense.belongsTo(Church, { foreignKey: 'churchId', as: 'church' });
Church.hasMany(Expense, { foreignKey: 'churchId', as: 'expenses' });

export default Expense;
