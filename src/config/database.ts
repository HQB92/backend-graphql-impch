import { Sequelize } from 'sequelize';
import 'dotenv/config';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, NODE_ENV, PGSSL } = process.env;

// Determinar si se debe usar SSL basado en el entorno y si es una conexión local
const isLocalhost = PGHOST === 'localhost' || PGHOST === '127.0.0.1' || !PGHOST;

// Permitir control explícito mediante variable de entorno PGSSL
// Si PGSSL está definido, usar ese valor, sino determinar automáticamente
let useSSL = false;
if (PGSSL !== undefined) {
    // Si PGSSL está definido, usar su valor (true/false como string)
    useSSL = PGSSL === 'true' || PGSSL === '1';
} else {
    // Comportamiento por defecto: solo usar SSL en producción y si no es localhost
    useSSL = NODE_ENV === 'production' && !isLocalhost;
}

console.log('[Database Config] SSL Configuration:', {
    PGHOST,
    NODE_ENV,
    isLocalhost,
    PGSSL,
    useSSL,
});

// Configurar opciones de dialecto
// Cuando useSSL es false, NO incluimos la opción ssl en absoluto
const sequelizeConfig: any = {
    host: PGHOST || 'localhost',
    port: Number(PGPORT) || 5432,
    dialect: 'postgres',
    logging: NODE_ENV === 'development' ? console.log : false,
};

// Solo agregar SSL si está habilitado
if (useSSL) {
    sequelizeConfig.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = new Sequelize(
    PGDATABASE || 'impch_db',
    PGUSER || 'postgres',
    PGPASSWORD || 'postgres',
    sequelizeConfig
);

export default sequelize;
