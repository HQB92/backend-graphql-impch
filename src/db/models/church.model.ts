import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface ChurchAttributes {
    id: number;
    name: string;
    address?: string | null;
    distanceToMotherTemple?: string | null;
    pastor?: string | null;
    landlinePhone?: string | null;
    mobilePhone?: string | null;
    capacity?: string | null;
    sectorNumber?: string | null;
}

interface ChurchCreationAttributes extends Optional<ChurchAttributes, 'id'> {}

class Church extends Model<ChurchAttributes, ChurchCreationAttributes> implements ChurchAttributes {
    public id!: number;
    public name!: string;
    public address?: string | null;
    public distanceToMotherTemple?: string | null;
    public pastor?: string | null;
    public landlinePhone?: string | null;
    public mobilePhone?: string | null;
    public capacity?: string | null;
    public sectorNumber?: string | null;
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
    distanceToMotherTemple: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pastor: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    landlinePhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mobilePhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sectorNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Church',
    tableName: 'Churches',
});

export default Church;
