import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import SectorChurch from './sectorChurch.model';

interface SectorMerriageRecordAttributes {
    id: number;
    sectorChurchId: number;
    husbandId: string;
    fullNameHusband: string;
    wifeId: string;
    fullNameWife: string;
    civilCode: number;
    civilDate: Date;
    civilPlace: string;
    religiousDate: Date;
    deleted: boolean;
}

interface SectorMerriageRecordCreationAttributes extends Optional<SectorMerriageRecordAttributes, 'id' | 'deleted'> {}

class SectorMerriageRecord extends Model<SectorMerriageRecordAttributes, SectorMerriageRecordCreationAttributes> implements SectorMerriageRecordAttributes {
    public id!: number;
    public sectorChurchId!: number;
    public husbandId!: string;
    public fullNameHusband!: string;
    public wifeId!: string;
    public fullNameWife!: string;
    public civilCode!: number;
    public civilDate!: Date;
    public civilPlace!: string;
    public religiousDate!: Date;
    public deleted!: boolean;
}

SectorMerriageRecord.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    sectorChurchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: SectorChurch, key: 'id' },
    },
    husbandId: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    fullNameHusband: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    wifeId: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    fullNameWife: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    civilCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    civilDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    civilPlace: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    religiousDate: {
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
    modelName: 'SectorMerriageRecord',
    tableName: 'SectorMerriageRecords',
    timestamps: true,
});

SectorMerriageRecord.belongsTo(SectorChurch, { foreignKey: 'sectorChurchId', as: 'sectorChurch' });

export default SectorMerriageRecord;
