import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import SectorChurch from './sectorChurch.model';

interface SectorBaptismRecordAttributes {
    id: number;
    sectorChurchId: number;
    childRUT: string;
    childFullName: string;
    childDateOfBirth: Date;
    fatherRUT?: string | null;
    fatherFullName?: string | null;
    motherRUT: string;
    motherFullName: string;
    placeOfRegistration: string;
    baptismDate: Date;
    registrationNumber: string;
    registrationDate: Date;
    deleted: boolean;
}

interface SectorBaptismRecordCreationAttributes extends Optional<SectorBaptismRecordAttributes, 'id' | 'fatherRUT' | 'fatherFullName' | 'deleted'> {}

class SectorBaptismRecord extends Model<SectorBaptismRecordAttributes, SectorBaptismRecordCreationAttributes> implements SectorBaptismRecordAttributes {
    public id!: number;
    public sectorChurchId!: number;
    public childRUT!: string;
    public childFullName!: string;
    public childDateOfBirth!: Date;
    public fatherRUT?: string | null;
    public fatherFullName?: string | null;
    public motherRUT!: string;
    public motherFullName!: string;
    public placeOfRegistration!: string;
    public baptismDate!: Date;
    public registrationNumber!: string;
    public registrationDate!: Date;
    public deleted!: boolean;
}

SectorBaptismRecord.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sectorChurchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: SectorChurch, key: 'id' },
    },
    childRUT: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    childFullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    childDateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fatherRUT: {
        type: DataTypes.STRING(12),
        allowNull: true,
    },
    fatherFullName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    motherRUT: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    motherFullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placeOfRegistration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    baptismDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'SectorBaptismRecord',
    tableName: 'SectorBaptismRecords',
    timestamps: true,
});

SectorBaptismRecord.belongsTo(SectorChurch, { foreignKey: 'sectorChurchId', as: 'sectorChurch' });

export default SectorBaptismRecord;
