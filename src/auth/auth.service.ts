import {generateToken} from '../utils/auth';
import {userLogs, passwordLogs} from '../utils/tokensLogs';
import {logger} from '../utils/logger';
import userType from "../types/userType";

const login = async (username:string, password: string) => {
	const {findUserByUsername} = require('../services/users.service');
	const operation = 'Auth - Login';
	logger.logStart(operation);
	logger.logAuthUsername(operation, username);
	logger.logAuthPassword(operation, password);
	const user:userType = await findUserByUsername(username)
	userLogs(user);
	passwordLogs(password, user);
	const token = generateToken(user.id, username, user.email, user.rut, user.roles);
	logger.logToken(operation, token);
	logger.logEnd(operation);
	return token;
};

export {login};
