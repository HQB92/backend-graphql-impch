// src/models/iglesia/iglesiaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BaptismRecordModel = sequelize.define('BaptismRecord', {
    childRut: {
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
    fatherRut: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fatherFullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherRut: {
        type: DataTypes.STRING(12),
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
}, {
    tableName: 'BaptismRecords',
    timestamps: true
});

module.exports = BaptismRecordModel;