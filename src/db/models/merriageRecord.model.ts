import { DataTypes, Model, Sequelize } from 'sequelize';

class MerriageRecord extends Model {
    public id!: number;
    public husbandId!: string;
    public fullNameHusband!: string;
    public wifeId!: string;
    public fullNameWife!: string;
    public civilCode!: number;
    public civilDate!: Date;
    public civilPlace!: string;
    public religiousDate!: Date;
}

export function initializeMerriageRecord(sequelize: Sequelize): typeof MerriageRecord {
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
        }
    }, {
        sequelize,
        tableName: 'merriageRecords',
    });

    return MerriageRecord;
}

export default MerriageRecord;