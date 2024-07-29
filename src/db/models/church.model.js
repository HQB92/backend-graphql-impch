
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ChurchModel = sequelize.define('Church', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = ChurchModel