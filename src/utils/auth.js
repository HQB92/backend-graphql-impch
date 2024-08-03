const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId, username, email, rut, roles) => {
    return jwt.sign({ userId, username, email, rut, roles }, process.env.SECRET_KEY, { expiresIn: '3h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid/Expired token');
    }
};

module.exports = { generateToken, verifyToken };
