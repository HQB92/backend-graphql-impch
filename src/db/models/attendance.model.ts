import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Rehearsal from './rehearsal.model';
import Member from './member.model';

interface AttendanceAttributes {
    id: number;
    rehearsalId: number;
    memberRut: string;
    attendedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
    public id!: number;
    public rehearsalId!: number;
    public memberRut!: string;
    public attendedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Attendance.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rehearsalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Rehearsal,
            key: 'id',
        },
    },
    memberRut: {
        type: DataTypes.STRING(12),
        allowNull: false,
        references: {
            model: Member,
            key: 'rut',
        },
    },
    attendedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
    modelName: 'Attendance',
    tableName: 'Attendances',
    indexes: [
        {
            unique: true,
            fields: ['rehearsalId', 'memberRut'],
            name: 'unique_rehearsal_member',
        },
    ],
});

// Definir relaciones
Rehearsal.hasMany(Attendance, {
    foreignKey: 'rehearsalId',
    as: 'attendances',
});

Attendance.belongsTo(Rehearsal, {
    foreignKey: 'rehearsalId',
    as: 'rehearsal',
});

Attendance.belongsTo(Member, {
    foreignKey: 'memberRut',
    as: 'member',
});

export default Attendance;
