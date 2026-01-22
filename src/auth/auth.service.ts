import { generateToken } from '../utils/auth';
import { userLogs, passwordLogs } from '../utils/tokensLogs';
import logger from '../utils/logger';
import { findUserByUsername } from '../services/users.service';

const login = async (username: string, password: string): Promise<string> => {
    const operation = 'Auth - Login';
    logger.logStart(operation);
    logger.logAuthUsername(operation, username);
    logger.logAuthPassword(operation, password);
    
    try {
        const user = await findUserByUsername(username);
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        userLogs(user);
        passwordLogs(password, user);
        
        const token = generateToken(user.id, username, user.email, user.rut, user.roles);
        logger.logToken(operation, token);
        logger.logEnd(operation);
        return token;
    } catch (error: any) {
        // Detectar errores de SSL y proporcionar un mensaje más útil
        if (error.message && error.message.includes('SSL')) {
            const sslError = new Error(
                'Error de conexión SSL con la base de datos. ' +
                'Si tu servidor PostgreSQL no soporta SSL, agrega PGSSL=false en el archivo .env del backend.'
            );
            logger.logError(operation, sslError.message);
            throw sslError;
        }
        
        // Re-lanzar otros errores
        logger.logError(operation, error.message || error);
        throw error;
    }
};

export { login };
