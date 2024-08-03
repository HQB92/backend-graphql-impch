import { Sequelize } from 'sequelize';
import 'dotenv/config';

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sequelize = new Sequelize(
    PGDATABASE as string,
    PGUSER as string,
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
    }
);

export default sequelize;