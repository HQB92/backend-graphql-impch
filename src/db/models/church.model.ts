import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface ChurchAttributes {
    id: number;
    name: string;
    address?: string | null;
}

interface ChurchCreationAttributes extends Optional<ChurchAttributes, 'id'> {}

class Church extends Model<ChurchAttributes, ChurchCreationAttributes> implements ChurchAttributes {
    public id!: number;
    public name!: string;
    public address?: string | null;
}

Church.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Church',
    tableName: 'Churches',
});

export default Church;
