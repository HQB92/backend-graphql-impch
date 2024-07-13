const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Status = sequelize.define('Status', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Status;

Status.sync({ force: false }).then(() => {
    console.log('Tabla Status sincronizada');
});