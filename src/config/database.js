const { Sequelize } = require('sequelize');
require('dotenv').config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const sequelize = new Sequelize(
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    {
        host: PGHOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },

);

module.exports = sequelize;
