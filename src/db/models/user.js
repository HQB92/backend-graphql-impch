const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Member = require('./member');


const User = sequelize.define('User', {
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
},{
    hooks:{
        afterCreate: async(user, options) => {
            await Member.update({userId: user.id}, {where: {rut: user.rut}});
        }
    }
});

module.exports = User;