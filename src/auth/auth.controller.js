const { login } = require('./auth.service');

const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    let token = await login(username, password);
    token = token.replace(/"/g, '');
    res.send({ token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = { loginController };
