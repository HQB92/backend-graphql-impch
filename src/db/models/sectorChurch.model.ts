import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface SectorChurchAttributes {
    id: number;
    name: string;
    password: string;
    pastor?: string | null;
    address?: string | null;
    phone?: string | null;
}

interface SectorChurchCreationAttributes extends Optional<SectorChurchAttributes, 'id' | 'pastor' | 'address' | 'phone'> {}

class SectorChurch extends Model<SectorChurchAttributes, SectorChurchCreationAttributes> implements SectorChurchAttributes {
    public id!: number;
    public name!: string;
    public password!: string;
    public pastor?: string | null;
    public address?: string | null;
    public phone?: string | null;
}

SectorChurch.init({
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pastor: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'SectorChurch',
    tableName: 'SectorChurches',
});

export default SectorChurch;
