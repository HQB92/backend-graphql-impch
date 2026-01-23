import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface MerriageRecordAttributes {
    id: number;
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

interface MerriageRecordCreationAttributes extends Optional<MerriageRecordAttributes, 'id' | 'deleted'> {}

class MerriageRecord extends Model<MerriageRecordAttributes, MerriageRecordCreationAttributes> implements MerriageRecordAttributes {
    public id!: number;
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

MerriageRecord.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
    }
}, {
    sequelize,
    modelName: 'merriageRecord',
    tableName: 'merriageRecords',
    timestamps: false,
});

export default MerriageRecord;
