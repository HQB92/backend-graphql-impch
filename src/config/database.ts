import { Sequelize } from 'sequelize';
import 'dotenv/config';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, NODE_ENV } = process.env;

// Determinar si se debe usar SSL basado en el entorno y si es una conexión local
const isLocalhost = PGHOST === 'localhost' || PGHOST === '127.0.0.1' || !PGHOST;
const useSSL = NODE_ENV === 'production' && !isLocalhost;

const sequelize = new Sequelize(
    PGDATABASE || 'impch_db',
    PGUSER || 'postgres',
    PGPASSWORD || 'postgres',
    {
        host: PGHOST || 'localhost',
        port: Number(PGPORT) || 5432,
        dialect: 'postgres',
        dialectOptions: useSSL ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        } : {},
        logging: NODE_ENV === 'development' ? console.log : false,
    }
);

export default sequelize;
