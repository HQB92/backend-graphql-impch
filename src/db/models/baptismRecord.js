// src/models/iglesia/iglesiaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BaptismRecord = sequelize.define('BaptismRecord', {
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
        type: DataTypes.STRING,
        allowNull: true
    },
    fatherFullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    motherRUT: {
        type: DataTypes.STRING,
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
    }
});

module.exports = BaptismRecord;