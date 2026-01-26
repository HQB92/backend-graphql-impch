import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Church from './church.model';

interface RehearsalAttributes {
    id: number;
    date: Date;
    description?: string | null;
    churchId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface RehearsalCreationAttributes extends Optional<RehearsalAttributes, 'id' | 'description' | 'churchId' | 'createdAt' | 'updatedAt'> {}

class Rehearsal extends Model<RehearsalAttributes, RehearsalCreationAttributes> implements RehearsalAttributes {
    public id!: number;
    public date!: Date;
    public description?: string | null;
    public churchId?: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Rehearsal.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    churchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Church,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Rehearsal',
    tableName: 'Rehearsals',
});

Rehearsal.belongsTo(Church, {
    foreignKey: 'churchId',
    as: 'church',
});

export default Rehearsal;
