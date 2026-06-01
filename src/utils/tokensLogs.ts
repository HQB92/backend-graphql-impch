import bcrypt from "bcryptjs";

const ADMIN_ROLE = 'Administrador';

export const isAdmin = (user: any): boolean => {
    return Array.isArray(user?.roles) && user.roles.includes(ADMIN_ROLE);
};

export const effectiveChurchId = (user: any, requestedChurchId?: number | null): number | undefined => {
    if (isAdmin(user)) return requestedChurchId ?? undefined;
    return user?.churchId ?? undefined;
};

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
