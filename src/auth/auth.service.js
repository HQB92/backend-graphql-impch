const bcrypt = require('bcryptjs');
const { generateToken } = require('./auth');
const { findUserByUsername } = require('../services/users');
const { userLogs, passwordLogs } = require('../utils/tokensLogs');
const logger = require('../utils/logger');

const login = async (username, password) => {
    const operation = 'Auth - Login';
    logger.logStart(operation);
    logger.logAuthUsername(operation, username);
    logger.logAuthPassword(operation, password);
    const user = await findUserByUsername(username);
    userLogs(user);
    passwordLogs(password, user);
    const token = generateToken(user.id, username, user.email, user.rut);
    logger.logToken(operation, token);
    logger.logEnd(operation);
    return token;
};

module.exports = { login };
