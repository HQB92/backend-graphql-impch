import 'dotenv/config';

// Permitir control explícito mediante variable de entorno PGSSL
// Por defecto, NO usar SSL a menos que se especifique explícitamente
let useSSL = false;
if (process.env.PGSSL !== undefined) {
    useSSL = process.env.PGSSL === 'true' || process.env.PGSSL === '1';
} else {
    // Comportamiento por defecto: NO usar SSL
    useSSL = false;
}

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
