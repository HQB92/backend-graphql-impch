import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface StatusAttributes {
    id: number;
    name: string;
    description: string;
}

interface StatusCreationAttributes extends Optional<StatusAttributes, 'id'> {}

class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
}

Status.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Status',
    tableName: 'Statuses',
});

export default Status;
