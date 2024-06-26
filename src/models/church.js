// src/models/iglesia/iglesiaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Church = sequelize.define('Church', {
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

module.exports = Church

Church.sync({ force: false }).then(async() => {
    console.log('Tabla Church sincronizada');
    /*await Church.create({
        name: 'Zañartu',
        address: 'Calle Ñuble 142'
    })*/
});
