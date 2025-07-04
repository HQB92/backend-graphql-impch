const logger = require('../utils/logger');
const { login } = require('./auth.service');

const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("LoginController");
    console.log(username, password);
    let token = await login(username, password);
    token = token.replace(/"/g, '');
    res.send({ token });
  } catch (error) {
    logger.logError("Auth - Login", error.message);
    res.status(401).send(error.message);
  }
};

module.exports = { loginController };
