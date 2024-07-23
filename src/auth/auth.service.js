const bcrypt = require('bcryptjs');
const { generateToken } = require('./auth');
const { findUserByUsername } = require('../services/users');
const { userLogs, passwordLogs } = require('../utils/tokensLogs');

const login = async (username, password) => {
    console.log('login - Inicio:', new Date().toISOString());
    console.log('login - username:', username);
    console.log('login - password: *******');
    const user = await findUserByUsername(username);
    userLogs(user);
    passwordLogs(password, user);
    const token = generateToken(user.id, username, user.email, user.rut);
    console.log('login - token:', token);
    console.log('login - Fin:', new Date().toISOString());
};

module.exports = { login };
