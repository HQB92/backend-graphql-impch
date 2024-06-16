const bcrypt = require('bcryptjs');
const { generateToken } = require('./auth');
const { findUserByUsername } = require('../services/users');

const login = async (username, password) => {
    const user = await findUserByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }

    return generateToken(user.id, username, user.email, user.rut);
};

module.exports = { login };
