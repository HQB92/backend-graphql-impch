const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database');
const Member = require('./member.model');


const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rut: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  }
}, {
  hooks: {
    afterCreate: async (user, options) => {
      await Member.update({userId: user.id}, {where: {rut: user.rut}});
    }
  }
});

UserModel.hasOne(Member, {foreignKey: 'userId', sourceKey: 'id'});
Member.belongsTo(UserModel, {foreignKey: 'userId', targetKey: 'id'});

module.exports = UserModel;