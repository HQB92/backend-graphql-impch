import bcrypt from "bcryptjs";

const ADMIN_ROLE = 'Administrador';
export const SECTOR_ROLE = 'PastorSector';

// Servicios que una cuenta de sector puede usar; son también los únicos
// que exigen ser PastorSector o Administrador.
const SECTOR_SERVICES = ['SectorBaptismRecord', 'SectorMerriageRecord', 'SectorChurch'];

const UNAUTHORIZED = 'No autorizado';

export const isAdmin = (user: any): boolean => {
    return Array.isArray(user?.roles) && user.roles.includes(ADMIN_ROLE);
};

export const isSectorPastor = (user: any): boolean => {
    return Array.isArray(user?.roles) && user.roles.includes(SECTOR_ROLE);
};

export const effectiveChurchId = (user: any, requestedChurchId?: number | null): number | undefined => {
    if (isAdmin(user)) return requestedChurchId ?? undefined;
    return user?.churchId ?? undefined;
};

const toPositiveInt = (value: unknown): number | null => {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
};

// Iglesia del sector a la que se limita una consulta. undefined = todas,
// y solo es posible para un administrador que no pide ninguna.
export const sectorScope = (user: any, requestedSectorChurchId?: number | string | null): number | undefined => {
    // PastorSector se evalúa primero: si un usuario tiene además Administrador,
    // gana la regla más restrictiva.
    if (isSectorPastor(user)) {
        const own = toPositiveInt(user.sectorChurchId);
        if (own === null) throw new Error(UNAUTHORIZED);
        return own;
    }
    if (isAdmin(user)) {
        if (requestedSectorChurchId === undefined || requestedSectorChurchId === null || requestedSectorChurchId === '') {
            return undefined;
        }
        const requested = toPositiveInt(requestedSectorChurchId);
        if (requested === null) throw new Error(UNAUTHORIZED);
        return requested;
    }
    throw new Error(UNAUTHORIZED);
};

export const validateContext = (user: any, patchService: string): void => {
  if (!user) {
    console.log(patchService, ' - getAll - Error: You are not authenticated!');
    console.log(patchService, ' - getAll - Fin:', new Date().toISOString());
    throw new Error('You are not authenticated!');
  }

  const isSectorService = SECTOR_SERVICES.includes(patchService);
  if (isSectorPastor(user)) {
    if (!isSectorService) throw new Error(UNAUTHORIZED);
    return;
  }
  if (isSectorService && !isAdmin(user)) throw new Error(UNAUTHORIZED);
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
