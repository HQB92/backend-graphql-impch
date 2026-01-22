import bcrypt from "bcryptjs";

export const validateContext = (user: any, patchService: string): void => {
  if (!user) {
    console.log(patchService, ' - getAll - Error: You are not authenticated!');
    console.log(patchService, ' - getAll - Fin:', new Date().toISOString());
    throw new Error('You are not authenticated!');
  }
};

export const userLogs = (user: any): void => {
  if (!user) {
    console.log('Auth - Login - Usuario no encontrado');
    console.log('Auth - Login - Fin:', new Date().toISOString());
    throw new Error('Usuario no encontrado');
  }
}

export const passwordLogs = (pass: string, user: any): void => {
  const valid = bcrypt.compareSync(pass, user.password);
  if (!valid) {
    console.log('Auth - Login - Contraseña inválida');
    console.log('Auth - Login - Fin:', new Date().toISOString());
    throw new Error('Contraseña inválida');
  }
}
