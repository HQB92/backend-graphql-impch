const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Church = require('./church.model');
const Status = require('./status.model');

const MemberModel = sequelize.define('Member', {
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
      table: 'Churches',
      key: 'id',
    },
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Status,
      table: 'Statuses',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      table: 'Users',
      key: 'id',
    },
  },
  sexo: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
});

module.exports = MemberModel;

MemberModel.belongsTo(Status, {
  foreignKey: 'statusId',
  as: 'status',
});

//relacionar con church
MemberModel.belongsTo(Church, {
  foreignKey: 'churchId',
  as: 'church',
});