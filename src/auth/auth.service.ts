import { generateToken } from '../utils/auth';
import { userLogs, passwordLogs } from '../utils/tokensLogs';
import logger from '../utils/logger';
import { findUserByUsername } from '../services/users.service';

const login = async (username: string, password: string): Promise<string> => {
    const operation = 'Auth - Login';
    logger.logStart(operation);
    logger.logAuthUsername(operation, username);
    logger.logAuthPassword(operation, password);
    const user = await findUserByUsername(username);
    userLogs(user);
    passwordLogs(password, user);
    const token = generateToken(user!.id, username, user!.email, user!.rut, user!.roles);
    logger.logToken(operation, token);
    logger.logEnd(operation);
    return token;
};

export { login };
