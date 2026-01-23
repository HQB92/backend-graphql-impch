import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface BaptismRecordAttributes {
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

interface BaptismRecordCreationAttributes extends Optional<BaptismRecordAttributes, 'fatherRUT' | 'fatherFullName' | 'deleted'> {}

class BaptismRecord extends Model<BaptismRecordAttributes, BaptismRecordCreationAttributes> implements BaptismRecordAttributes {
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

BaptismRecord.init({
    childRUT: {
        type: DataTypes.STRING(12),
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    childFullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    childDateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fatherRUT: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fatherFullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherRUT: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    motherFullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    placeOfRegistration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    baptismDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'BaptismRecord',
    tableName: 'BaptismRecords',
    timestamps: true
});

export default BaptismRecord;
