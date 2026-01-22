import 'dotenv/config';

// Determinar si se debe usar SSL basado en el entorno y si es una conexión local
const isLocalhost = process.env.PGHOST === 'localhost' || process.env.PGHOST === '127.0.0.1' || !process.env.PGHOST;
const useSSL = process.env.NODE_ENV === 'production' && !isLocalhost;

interface DatabaseConfig {
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string;
    port: string | number;
    dialect: string;
    dialectOptions?: {
        ssl?: {
            require: boolean;
            rejectUnauthorized: boolean;
        };
    };
    seederStorage: string;
    seederStorageTableName: string;
}

const config: { [key: string]: DatabaseConfig } = {
    development: {
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
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
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
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
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        seederStorage: 'sequelize',
        seederStorageTableName: 'SequelizeData',
    },
};

module.exports = config;
