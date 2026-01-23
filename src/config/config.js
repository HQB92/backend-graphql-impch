require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, NODE_ENV, PGSSL } = process.env;

// Permitir control explícito mediante variable de entorno PGSSL
let useSSL = false;
if (PGSSL !== undefined) {
    useSSL = PGSSL === 'true' || PGSSL === '1';
} else {
    useSSL = false;
}

const config = {
    development: {
        username: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        host: PGHOST || 'localhost',
        port: PGPORT || 5432,
        dialect: 'postgres',
        ...(useSSL && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        }),
        seederStorage: 'sequelize',
        seederStorageTableName: 'SequelizeData',
    },
    test: {
        username: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        host: PGHOST || 'localhost',
        port: PGPORT || 5432,
        dialect: 'postgres',
        ...(useSSL && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        }),
        seederStorage: 'sequelize',
        seederStorageTableName: 'SequelizeData',
    },
    production: {
        username: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        host: PGHOST || 'localhost',
        port: PGPORT || 5432,
        dialect: 'postgres',
        ...(useSSL && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        }),
        seederStorage: 'sequelize',
        seederStorageTableName: 'SequelizeData',
    },
};

module.exports = config;
