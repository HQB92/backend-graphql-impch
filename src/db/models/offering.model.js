const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database');
const {User, Church} = require('./index');

const Offering = sequelize.define('Offering', {
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
      model: User,
      table: 'Users',
      key: 'id'
    },
  },
  state:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  }

},
  {
    tableName: 'Offerings',
  }
);


