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

//sequelize que solo crees si no existe la tabla
/*Status.sync({ force: false}).then(async () => {
    console.log('Tabla Status sincronizada');
    await Status.create({
        name: 'Activo',
        description: 'Miembro activo'
    });
    await Status.create({
        name: 'Inactivo',
        description: 'Miembro inactivo'
    });
    await Status.create({
        name: 'Fallecido',
        description: 'Miembro fallecido'
    });
    await Status.create({
        name: 'Trasladado',
        description: 'Miembro se trasladó a otra iglesia o misión'
    });
    await Status.create({
        name: 'Expulsado',
        description: 'Miembro expulsado de la iglesia'
    });
});*/