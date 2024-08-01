const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database');
const Church = require('./church.model');

const Bank = sequelize.define('Bank', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  churchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Church,
      table: 'Churches',
      key: 'id'
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      table: 'Users',
      key: 'id'
    },
  },
  state:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    tableName: 'Banks',
  }
);

Bank.belongsTo(Church, {foreignKey: 'churchId', as: 'church'});
Church.hasMany(Bank, {foreignKey: 'id', as: 'Banks'});

module.exports = Bank;

