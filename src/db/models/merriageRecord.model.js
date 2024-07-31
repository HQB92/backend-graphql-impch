
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const MerriageRecord = sequelize.define('merriageRecord', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    husbandId: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    fullNameHusband: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    wifeId: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    fullNameWife: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    civilCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    civilDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    civilPlace: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    religiousDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    tableName: 'merriageRecords',
    timestamps: false,
});

module.exports = MerriageRecord;
