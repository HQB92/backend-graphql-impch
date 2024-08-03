import * as bcrypt from 'bcryptjs';
import userType from "../types/userType";

const validateContext = (user: userType, patchService: any) => {
    if (!user) {
        console.log(patchService, ' - getAll - Error: You are not authenticated!');
        console.log(patchService, ' - getAll - Fin:', new Date().toISOString());
        throw new Error('You are not authenticated!');
    }
};

const userLogs = (user: userType) => {
    if (!user) {
        console.log('Auth - Login - Usuario no encontrado');
        console.log('Auth - Login - Fin:', new Date().toISOString());
        throw new Error('Usuario no encontrado');
    }
}

const passwordLogs = (pass: string, user: userType) => {
    const valid = bcrypt.compareSync(pass, user.password);
    if (!valid) {
        console.log('Auth - Login - Contraseña inválida');
        console.log('Auth - Login - Fin:', new Date().toISOString());
        throw new Error('Contraseña inválida');
    }
}

export {
    validateContext,
    userLogs,
    passwordLogs
};