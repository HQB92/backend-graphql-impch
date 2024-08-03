const bcrypt = require("bcryptjs");

const validateContext = (user, patchService) => {
  if (!user) {
    console.log(patchService,' - getAll - Error: You are not authenticated!');
    console.log(patchService,' - getAll - Fin:', new Date().toISOString());
    throw new Error('You are not authenticated!');
  }
};

const userLogs = (user) => {
  if (!user) {
    console.log('Auth - Login - Usuario no encontrado');
    console.log('Auth - Login - Fin:', new Date().toISOString());
    throw new Error('Usuario no encontrado');
  }
}

const passwordLogs = (pass,user) => {
  const valid = bcrypt.compareSync(pass, user.password);
    if (!valid) {
        console.log('Auth - Login - Contraseña inválida');
        console.log('Auth - Login - Fin:', new Date().toISOString());
        throw new Error('Contraseña inválida');
    }
}

module.exports = {
    validateContext,
    userLogs,
    passwordLogs
};