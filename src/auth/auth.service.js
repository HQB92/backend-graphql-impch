const bcrypt = require('bcryptjs');
const { generateToken } = require('./auth');
const { findUserByUsername } = require('../services/users');
const { userLogs, passwordLogs } = require('../utils/tokensLogs');

const login = async (username, password) => {
    console.log('Auth - Login - Inicio:', new Date().toISOString());
    console.log('Auth - Login - username:', username);
    console.log('Auth - Login - password: *******');
    const user = await findUserByUsername(username);
    userLogs(user);
    passwordLogs(password, user);
    const token = generateToken(user.id, username, user.email, user.rut);
    console.log('Auth - Login - token:', token);
    console.log('Auth - Login - Fin:', new Date().toISOString());
    return token;
};

module.exports = { login };
