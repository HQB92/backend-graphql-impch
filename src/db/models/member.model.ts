import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Church from './church.model';
import Status from './status.model';

interface MemberAttributes {
    rut: string;
    names: string;
    lastNameDad: string;
    lastNameMom: string;
    dateOfBirth: Date;
    address: string;
    telephone: string;
    mobile: string;
    email: string;
    maritalStatus: string;
    probationStartDate?: Date | null;
    fullMembershipDate?: Date | null;
    churchId?: number | null;
    statusId?: number | null;
    userId?: number | null;
    sexo: string;
}

interface MemberCreationAttributes extends Optional<MemberAttributes, 'probationStartDate' | 'fullMembershipDate' | 'churchId' | 'statusId' | 'userId'> {}

class Member extends Model<MemberAttributes, MemberCreationAttributes> implements MemberAttributes {
    public rut!: string;
    public names!: string;
    public lastNameDad!: string;
    public lastNameMom!: string;
    public dateOfBirth!: Date;
    public address!: string;
    public telephone!: string;
    public mobile!: string;
    public email!: string;
    public maritalStatus!: string;
    public probationStartDate?: Date | null;
    public fullMembershipDate?: Date | null;
    public churchId?: number | null;
    public statusId?: number | null;
    public userId?: number | null;
    public sexo!: string;
}

Member.init({
    rut: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    names: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastNameDad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastNameMom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maritalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    probationStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fullMembershipDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    churchId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Church,
            key: 'id',
        },
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Status,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    sexo: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Member',
    tableName: 'Members',
});

Member.belongsTo(Status, {
    foreignKey: 'statusId',
    as: 'status',
});

Member.belongsTo(Church, {
    foreignKey: 'churchId',
    as: 'church',
});

export default Member;
