# Acceso de pastores del sector — Plan de implementación (backend)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada iglesia del sector inicie sesión con su nombre y clave y gestione solo sus propios bautizos y matrimonios, sin acceso al resto de la API.

**Architecture:** Tres tablas nuevas (`SectorChurches`, `SectorBaptismRecords`, `SectorMerriageRecords`) separadas de las de Zañartu. Un login propio emite un JWT con rol `PastorSector` y `sectorChurchId`. La autorización se centraliza en `validateContext` (qué servicios puede usar cada rol) y en `sectorScope` (de qué iglesia son los datos); los servicios siempre filtran por ese alcance.

**Tech Stack:** Node 24, TypeScript 5.9, Express 5, Apollo Server 5, Sequelize 6 + PostgreSQL 16, bcryptjs, jsonwebtoken, `node:test` con `ts-node`.

**Spec:** `../docs/superpowers/specs/2026-10-07-acceso-pastores-sector-design.md` (ruta absoluta: `/Users/hquinteb/Desarrollo/Personal/Zañartu/docs/superpowers/specs/2026-10-07-acceso-pastores-sector-design.md`). Léela antes de empezar.

**Plan hermano:** `frontend-impch-zanartu/docs/superpowers/plans/2026-10-07-acceso-pastores-sector-frontend.md`. El backend va primero: el frontend consume lo que aquí se define.

## Global Constraints

- No se modifican las tablas `Churches`, `BaptismRecords` ni `merriageRecords`, ni sus servicios o resolvers.
- No se agregan dependencias. Los tests usan `node:test` y `ts-node`, que ya están instalados.
- El rol de las cuentas de sector es exactamente `PastorSector`. El de administrador es `Administrador`.
- Los nombres de servicio para `validateContext` son exactamente `SectorBaptismRecord`, `SectorMerriageRecord` y `SectorChurch`.
- Mensajes exactos: `Credenciales inválidas`, `No autorizado`, `Registro no encontrado`, `Registro de bautizo ya existe para este RUT`, `Clave actual incorrecta`.
- El token de sector dura `3h` y lleva solo `sectorChurchId`, `username` y `roles`. Nunca `userId`, `rut` ni `churchId`.
- Ninguna respuesta ni log incluye la clave ni su hash. No se registra el cuerpo de las peticiones de login.
- El `sectorChurchId` de un pastor sale siempre del token, nunca de lo que envía el cliente.
- La clave nueva tiene un mínimo de 8 caracteres.
- Indentación de 4 espacios en `.ts` y 2 en migraciones `.js`, como el código existente.
- Rama de trabajo: `feature/acceso-pastores-sector`. No se hace push ni merge a `main` sin que el usuario lo pida.

## Review Focus

1. **Un pastor pide los registros de otra iglesia** enviando un `sectorChurchId` ajeno en `getAll`: debe recibir solo los suyos. Test en Task 1 (`sectorScope`).
2. **Un pastor edita o elimina por `id` un registro de otra iglesia:** debe recibir 404 y el registro no cambia. Tests en Task 6 y Task 7.
3. **Un usuario de Zañartu recibe por error el rol `PastorSector`** desde la pantalla de Usuarios (no tiene `sectorChurchId`), o tiene `Administrador` y `PastorSector` a la vez: debe recibir `No autorizado`, nunca ver todas las iglesias. Tests en Task 1.
4. **Login con cuerpo incompleto o mal formado** (id no numérico, clave vacía o que no es texto): 401 `Credenciales inválidas`, sin consultar la base ni caerse. Test en Task 4.
5. **Formulario enviado con campos vacíos** (una fecha `''` llega como `null`): 400 con el nombre del campo faltante, no un 500, y no se inserta nada. Tests en Task 6 y Task 7.

## Cómo llegan los argumentos a un resolver (léelo antes de la Task 5)

`src/graphql/resolvers.ts` envuelve cada resolver anidado con `bindContextToResolvers`. Por cómo graphql-js invoca las propiedades función de un objeto, el resolver recibe:

- `parent`: los argumentos reales del campo (`{ id, baptismRecord, ... }`).
- `args`: las variables de toda la operación más `user`.
- `context`: `{ user }`.

Por eso los resolvers existentes leen `parent?.x || args?.x`. Los nuevos usan el helper `arg(parent, args, 'x')` definido en la Task 5.

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `src/utils/tokensLogs.ts` (modificar) | Reglas de rol: `isSectorPastor`, `sectorScope`, `validateContext` |
| `src/utils/auth.ts` (modificar) | `TokenPayload` y `generateSectorToken` |
| `src/db/migrations/20261007000001-create-sector-churches.js` | Tabla `SectorChurches` |
| `src/db/migrations/20261007000002-create-sector-baptism-records.js` | Tabla `SectorBaptismRecords` |
| `src/db/migrations/20261007000003-create-sector-merriage-records.js` | Tabla `SectorMerriageRecords` |
| `src/db/models/sectorChurch.model.ts` | Modelo de iglesia del sector |
| `src/db/models/sectorBaptismRecord.model.ts` | Modelo de bautizo del sector |
| `src/db/models/sectorMerriageRecord.model.ts` | Modelo de matrimonio del sector |
| `scripts/generate-sector-seed.js` | Genera claves al azar y el seeder con sus hashes |
| `src/db/seeders/20261007000004-seed-sector-churches.js` | Generado por el script; solo hashes |
| `src/auth/sectorAuth.service.ts` | Lista pública de iglesias y login de iglesia |
| `src/auth/auth.controller.ts`, `src/auth/auth.router.ts` (modificar) | Rutas `/auth/sector-churches` y `/auth/sector-login` |
| `src/services/sectorChurch.service.ts` | Perfil y cambio de clave |
| `src/services/sectorBaptismRecord.service.ts` | CRUD de bautizos con alcance por iglesia |
| `src/services/sectorMerriageRecord.service.ts` | CRUD de matrimonios con alcance por iglesia |
| `src/graphql/resolvers/sector.util.ts` | `runSector` y `arg`, compartidos por los tres resolvers |
| `src/graphql/typeDefs/sector*.typeDef.ts`, `src/graphql/resolvers/sector*.resolver.ts` | Esquema y resolvers de cada namespace |
| `src/graphql/typeDefs.ts`, `src/graphql/resolvers.ts` (modificar) | Registro de los tres namespaces |

---

### Task 0: Preparación

**Files:**
- Modify: `package.json`
- Create: `.env` (local, ya está en `.gitignore`)

- [ ] **Step 1: Crear la rama**

```bash
cd /Users/hquinteb/Desarrollo/Personal/Zañartu/backend-graphql-impch
git checkout -b feature/acceso-pastores-sector
```

- [ ] **Step 2: Instalar dependencias**

```bash
pnpm install
```

Expected: termina sin errores y existe `node_modules/`.

- [ ] **Step 3: Crear `.env` local si no existe**

Si ya existe un `.env`, no lo toques. Si no:

```bash
cat > .env <<'EOF'
PGHOST=localhost
PGPORT=5434
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=impch_db
PGSSL=false
NODE_ENV=development
SECRET_KEY=dev-secret-solo-local
PORT=4000
EOF
```

- [ ] **Step 4: Agregar scripts a `package.json`**

En `"scripts"`, después de `"db:migrate:status"`, agregar:

```json
    "db:seed:sector": "sequelize-cli db:seed --seed 20261007000004-seed-sector-churches.js",
    "test": "node --require ts-node/register --test \"src/**/*.test.ts\"",
```

- [ ] **Step 5: Verificar la línea base**

Run: `pnpm build`
Expected: compila sin errores. Si ya falla antes de tus cambios, detente y repórtalo.

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "chore: agregar scripts de test y seed de sector"
```

---

### Task 1: Reglas de autorización y token de sector

**Files:**
- Modify: `src/utils/tokensLogs.ts`
- Modify: `src/utils/auth.ts`
- Test: `src/utils/tokensLogs.test.ts`
- Test: `src/utils/auth.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces (desde `src/utils/tokensLogs.ts`):
  - `SECTOR_ROLE: 'PastorSector'`
  - `isSectorPastor(user: any): boolean`
  - `sectorScope(user: any, requestedSectorChurchId?: number | string | null): number | undefined` — devuelve la iglesia a la que se limita la consulta; `undefined` significa "todas" y solo ocurre para un administrador. Lanza `Error('No autorizado')` para cualquier otro caso.
  - `validateContext(user: any, patchService: string): void` — ahora también lanza `Error('No autorizado')`.
- Produces (desde `src/utils/auth.ts`):
  - `generateSectorToken(sectorChurchId: number, name: string): string`
  - `TokenPayload` con `userId`, `email`, `rut` opcionales y `sectorChurchId?: number`.

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/utils/tokensLogs.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContext, sectorScope, isSectorPastor } from './tokensLogs';

const pastor = { username: 'Bulnes', roles: ['PastorSector'], sectorChurchId: 3 };
const admin = { username: 'hugo', roles: ['Administrador'] };
const secretario = { username: 'camila', roles: ['Secretario'] };

const EXISTING_SERVICES = [
    'Attendance', 'Bank', 'BaptismRecord', 'Church', 'Expense', 'Inventory',
    'Member', 'MerriageRecord', 'Offering', 'Rehearsal', 'Status', 'User',
];
const SECTOR_SERVICES = ['SectorBaptismRecord', 'SectorMerriageRecord', 'SectorChurch'];

test('sin usuario no hay acceso a ningún servicio', () => {
    for (const service of [...EXISTING_SERVICES, ...SECTOR_SERVICES]) {
        assert.throws(() => validateContext(undefined, service), /not authenticated/);
    }
});

test('un pastor de sector es rechazado en todos los servicios existentes', () => {
    for (const service of EXISTING_SERVICES) {
        assert.throws(() => validateContext(pastor, service), /No autorizado/, service);
    }
});

test('un pastor de sector entra a los tres servicios de sector', () => {
    for (const service of SECTOR_SERVICES) {
        assert.doesNotThrow(() => validateContext(pastor, service), service);
    }
});

test('el administrador entra a todos los servicios', () => {
    for (const service of [...EXISTING_SERVICES, ...SECTOR_SERVICES]) {
        assert.doesNotThrow(() => validateContext(admin, service), service);
    }
});

test('un rol de Zañartu que no es administrador no entra a los servicios de sector', () => {
    for (const service of SECTOR_SERVICES) {
        assert.throws(() => validateContext(secretario, service), /No autorizado/, service);
    }
    for (const service of EXISTING_SERVICES) {
        assert.doesNotThrow(() => validateContext(secretario, service), service);
    }
});

test('isSectorPastor solo es verdadero con el rol PastorSector', () => {
    assert.equal(isSectorPastor(pastor), true);
    assert.equal(isSectorPastor(admin), false);
    assert.equal(isSectorPastor(undefined), false);
    assert.equal(isSectorPastor({ roles: 'PastorSector' }), false);
});

test('un pastor siempre obtiene su propia iglesia aunque pida otra', () => {
    assert.equal(sectorScope(pastor), 3);
    assert.equal(sectorScope(pastor, 7), 3);
    assert.equal(sectorScope(pastor, '7'), 3);
    assert.equal(sectorScope(pastor, null), 3);
});

test('el administrador obtiene la iglesia pedida o todas', () => {
    assert.equal(sectorScope(admin), undefined);
    assert.equal(sectorScope(admin, null), undefined);
    assert.equal(sectorScope(admin, 7), 7);
    assert.equal(sectorScope(admin, '7'), 7);
});

test('el administrador con un filtro inválido no obtiene todas las iglesias por accidente', () => {
    assert.throws(() => sectorScope(admin, 'abc'), /No autorizado/);
    assert.throws(() => sectorScope(admin, -1), /No autorizado/);
});

test('un rol PastorSector sin sectorChurchId es rechazado', () => {
    const mal = { username: 'camila', roles: ['Secretario', 'PastorSector'] };
    assert.throws(() => sectorScope(mal), /No autorizado/);
    assert.throws(() => sectorScope({ roles: ['PastorSector'], sectorChurchId: 0 }), /No autorizado/);
    assert.throws(() => sectorScope({ roles: ['PastorSector'], sectorChurchId: 'x' }), /No autorizado/);
});

test('Administrador y PastorSector a la vez se trata como pastor: la regla más restrictiva', () => {
    const ambos = { roles: ['Administrador', 'PastorSector'], sectorChurchId: 3 };
    assert.throws(() => validateContext(ambos, 'Offering'), /No autorizado/);
    assert.equal(sectorScope(ambos, 7), 3);
    assert.throws(() => sectorScope({ roles: ['Administrador', 'PastorSector'] }), /No autorizado/);
});

test('otros roles no tienen alcance de sector', () => {
    assert.throws(() => sectorScope(secretario), /No autorizado/);
    assert.throws(() => sectorScope(undefined), /No autorizado/);
});
```

Crear `src/utils/auth.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { generateSectorToken, generateToken, verifyToken } from './auth';

process.env.SECRET_KEY = 'test-secret';

test('el token de sector lleva solo iglesia, nombre y rol', () => {
    const token = generateSectorToken(3, 'Bulnes');
    const decoded = jwt.decode(token) as Record<string, unknown>;

    assert.equal(decoded.sectorChurchId, 3);
    assert.equal(decoded.username, 'Bulnes');
    assert.deepEqual(decoded.roles, ['PastorSector']);
    assert.equal('userId' in decoded, false);
    assert.equal('rut' in decoded, false);
    assert.equal('churchId' in decoded, false);
});

test('el token de sector dura 3 horas y se verifica con la misma clave', () => {
    const token = generateSectorToken(3, 'Bulnes');
    const decoded = verifyToken(token);

    assert.equal(decoded.sectorChurchId, 3);
    const payload = jwt.decode(token) as { iat: number; exp: number };
    assert.equal(payload.exp - payload.iat, 3 * 60 * 60);
});

test('el token de usuario de Zañartu no cambia', () => {
    const token = generateToken(1, 'hugo', 'a@a.cl', '18.156.271-4', ['Administrador'], 1);
    const decoded = verifyToken(token);

    assert.equal(decoded.userId, 1);
    assert.equal(decoded.churchId, 1);
    assert.equal(decoded.sectorChurchId, undefined);
});
```

- [ ] **Step 2: Ejecutar los tests y verificar que fallan**

Run: `pnpm test`
Expected: FAIL. Errores de TypeScript del tipo `Module './tokensLogs' has no exported member 'sectorScope'` y `'./auth' has no exported member 'generateSectorToken'`.

- [ ] **Step 3: Implementar las reglas en `src/utils/tokensLogs.ts`**

Reemplazar desde la línea `const ADMIN_ROLE = 'Administrador';` hasta el final de `validateContext` (deja `userLogs` y `passwordLogs` como están) por:

```ts
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
```

El mensaje `No autorizado` es deliberado: el frontend cierra la sesión cuando un error contiene `not authenticated` o trae el código `FORBIDDEN`, y este caso no debe cerrarla.

- [ ] **Step 4: Implementar el token en `src/utils/auth.ts`**

Reemplazar la interfaz `TokenPayload` y agregar `generateSectorToken` debajo de `generateToken`:

```ts
export interface TokenPayload {
    userId?: number;
    username: string;
    email?: string;
    rut?: string;
    roles: string[];
    churchId?: number | null;
    sectorChurchId?: number;
    exp?: number;
}
```

```ts
export const generateSectorToken = (sectorChurchId: number, name: string): string => {
    return jwt.sign(
        { sectorChurchId, username: name, roles: ['PastorSector'] },
        process.env.SECRET_KEY as string,
        { expiresIn: '3h' }
    );
};
```

- [ ] **Step 5: Ejecutar los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, 15 tests.

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/utils/tokensLogs.ts src/utils/tokensLogs.test.ts src/utils/auth.ts src/utils/auth.test.ts
git commit -m "feat: reglas de autorización y token para cuentas de sector"
```

---

### Task 2: Tablas y modelos

**Files:**
- Create: `src/db/migrations/20261007000001-create-sector-churches.js`
- Create: `src/db/migrations/20261007000002-create-sector-baptism-records.js`
- Create: `src/db/migrations/20261007000003-create-sector-merriage-records.js`
- Create: `src/db/models/sectorChurch.model.ts`
- Create: `src/db/models/sectorBaptismRecord.model.ts`
- Create: `src/db/models/sectorMerriageRecord.model.ts`
- Modify: `src/db/models/index.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `SectorChurch` (default export de `sectorChurch.model.ts`): `id`, `name`, `password`, `pastor`, `address`, `phone`.
  - `SectorBaptismRecord` (default export): `id`, `sectorChurchId`, los 11 campos de bautizo, `deleted`. Asociación `belongsTo(SectorChurch, { as: 'sectorChurch' })`.
  - `SectorMerriageRecord` (default export): `id`, `sectorChurchId`, los 8 campos de matrimonio, `deleted`. Asociación `belongsTo(SectorChurch, { as: 'sectorChurch' })`.

Esta tarea no tiene test unitario: su entregable se verifica ejecutando las migraciones contra Postgres (Step 6).

- [ ] **Step 1: Migración de `SectorChurches`**

Crear `src/db/migrations/20261007000001-create-sector-churches.js`:

```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SectorChurches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pastor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('SectorChurches');
  }
};
```

- [ ] **Step 2: Migración de `SectorBaptismRecords`**

Crear `src/db/migrations/20261007000002-create-sector-baptism-records.js`:

```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SectorBaptismRecords', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sectorChurchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: 'SectorChurches' },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      childRUT: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      childFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      childDateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      fatherRUT: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      fatherFullName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      motherRUT: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      motherFullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      placeOfRegistration: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      baptismDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      registrationNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      registrationDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('SectorBaptismRecords', ['sectorChurchId'], {
      name: 'idx_sector_baptism_church',
    });

    // Un RUT de niño no puede tener dos bautizos activos en el sector.
    await queryInterface.addIndex('SectorBaptismRecords', ['childRUT'], {
      name: 'uq_sector_baptism_child_rut_active',
      unique: true,
      where: { deleted: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('SectorBaptismRecords');
  }
};
```

`onDelete: 'RESTRICT'` es deliberado: borrar una iglesia no debe borrar sus certificados.

- [ ] **Step 3: Migración de `SectorMerriageRecords`**

Crear `src/db/migrations/20261007000003-create-sector-merriage-records.js`:

```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SectorMerriageRecords', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sectorChurchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: 'SectorChurches' },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      husbandId: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      fullNameHusband: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      wifeId: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      fullNameWife: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      civilCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      civilDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      civilPlace: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      religiousDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('SectorMerriageRecords', ['sectorChurchId'], {
      name: 'idx_sector_merriage_church',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('SectorMerriageRecords');
  }
};
```

- [ ] **Step 4: Modelos**

Crear `src/db/models/sectorChurch.model.ts`:

```ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface SectorChurchAttributes {
    id: number;
    name: string;
    password: string;
    pastor?: string | null;
    address?: string | null;
    phone?: string | null;
}

interface SectorChurchCreationAttributes extends Optional<SectorChurchAttributes, 'id' | 'pastor' | 'address' | 'phone'> {}

class SectorChurch extends Model<SectorChurchAttributes, SectorChurchCreationAttributes> implements SectorChurchAttributes {
    public id!: number;
    public name!: string;
    public password!: string;
    public pastor?: string | null;
    public address?: string | null;
    public phone?: string | null;
}

SectorChurch.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pastor: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'SectorChurch',
    tableName: 'SectorChurches',
});

export default SectorChurch;
```

Crear `src/db/models/sectorBaptismRecord.model.ts`:

```ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import SectorChurch from './sectorChurch.model';

interface SectorBaptismRecordAttributes {
    id: number;
    sectorChurchId: number;
    childRUT: string;
    childFullName: string;
    childDateOfBirth: Date;
    fatherRUT?: string | null;
    fatherFullName?: string | null;
    motherRUT: string;
    motherFullName: string;
    placeOfRegistration: string;
    baptismDate: Date;
    registrationNumber: string;
    registrationDate: Date;
    deleted: boolean;
}

interface SectorBaptismRecordCreationAttributes extends Optional<SectorBaptismRecordAttributes, 'id' | 'fatherRUT' | 'fatherFullName' | 'deleted'> {}

class SectorBaptismRecord extends Model<SectorBaptismRecordAttributes, SectorBaptismRecordCreationAttributes> implements SectorBaptismRecordAttributes {
    public id!: number;
    public sectorChurchId!: number;
    public childRUT!: string;
    public childFullName!: string;
    public childDateOfBirth!: Date;
    public fatherRUT?: string | null;
    public fatherFullName?: string | null;
    public motherRUT!: string;
    public motherFullName!: string;
    public placeOfRegistration!: string;
    public baptismDate!: Date;
    public registrationNumber!: string;
    public registrationDate!: Date;
    public deleted!: boolean;
}

SectorBaptismRecord.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sectorChurchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: SectorChurch, key: 'id' },
    },
    childRUT: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    childFullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    childDateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fatherRUT: {
        type: DataTypes.STRING(12),
        allowNull: true,
    },
    fatherFullName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    motherRUT: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    motherFullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placeOfRegistration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    baptismDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'SectorBaptismRecord',
    tableName: 'SectorBaptismRecords',
    timestamps: true,
});

SectorBaptismRecord.belongsTo(SectorChurch, { foreignKey: 'sectorChurchId', as: 'sectorChurch' });

export default SectorBaptismRecord;
```

Crear `src/db/models/sectorMerriageRecord.model.ts`:

```ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import SectorChurch from './sectorChurch.model';

interface SectorMerriageRecordAttributes {
    id: number;
    sectorChurchId: number;
    husbandId: string;
    fullNameHusband: string;
    wifeId: string;
    fullNameWife: string;
    civilCode: number;
    civilDate: Date;
    civilPlace: string;
    religiousDate: Date;
    deleted: boolean;
}

interface SectorMerriageRecordCreationAttributes extends Optional<SectorMerriageRecordAttributes, 'id' | 'deleted'> {}

class SectorMerriageRecord extends Model<SectorMerriageRecordAttributes, SectorMerriageRecordCreationAttributes> implements SectorMerriageRecordAttributes {
    public id!: number;
    public sectorChurchId!: number;
    public husbandId!: string;
    public fullNameHusband!: string;
    public wifeId!: string;
    public fullNameWife!: string;
    public civilCode!: number;
    public civilDate!: Date;
    public civilPlace!: string;
    public religiousDate!: Date;
    public deleted!: boolean;
}

SectorMerriageRecord.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    sectorChurchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: SectorChurch, key: 'id' },
    },
    husbandId: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    fullNameHusband: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    wifeId: {
        type: DataTypes.STRING(12),
        allowNull: false,
    },
    fullNameWife: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    civilCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    civilDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    civilPlace: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    religiousDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'SectorMerriageRecord',
    tableName: 'SectorMerriageRecords',
    timestamps: true,
});

SectorMerriageRecord.belongsTo(SectorChurch, { foreignKey: 'sectorChurchId', as: 'sectorChurch' });

export default SectorMerriageRecord;
```

- [ ] **Step 5: Exportar los modelos en `src/db/models/index.ts`**

Agregar los imports después de `import Expense from './expense.model';`:

```ts
import SectorChurch from './sectorChurch.model';
import SectorBaptismRecord from './sectorBaptismRecord.model';
import SectorMerriageRecord from './sectorMerriageRecord.model';
```

Y en el bloque `export { ... }`, cambiar `Expense` por:

```ts
    Expense,
    SectorChurch,
    SectorBaptismRecord,
    SectorMerriageRecord
```

- [ ] **Step 6: Ejecutar las migraciones y verificar**

```bash
pnpm db:up
pnpm db:migrate
```

Expected: las tres migraciones `20261007000001`, `20261007000002` y `20261007000003` aparecen como `migrated`. Si la base local está vacía, también se ejecutan las anteriores.

```bash
docker exec impch-postgres psql -U postgres -d impch_db -c '\d "SectorBaptismRecords"'
```

Expected: la tabla lista `sectorChurchId` con FK a `SectorChurches` y los índices `idx_sector_baptism_church` y `uq_sector_baptism_child_rut_active` (este último `UNIQUE ... WHERE deleted = false`).

Probar que la migración se puede deshacer y rehacer:

```bash
pnpm db:migrate:undo && pnpm db:migrate:undo && pnpm db:migrate:undo && pnpm db:migrate
```

Expected: tres `reverted` y luego tres `migrated`, sin errores.

Run: `pnpm build`
Expected: compila sin errores.

- [ ] **Step 7: Commit**

```bash
git add src/db/migrations/20261007000001-create-sector-churches.js \
        src/db/migrations/20261007000002-create-sector-baptism-records.js \
        src/db/migrations/20261007000003-create-sector-merriage-records.js \
        src/db/models/sectorChurch.model.ts \
        src/db/models/sectorBaptismRecord.model.ts \
        src/db/models/sectorMerriageRecord.model.ts \
        src/db/models/index.ts
git commit -m "feat: tablas y modelos de iglesias, bautizos y matrimonios del sector"
```

---

### Task 3: Seed de las iglesias del sector

**Files:**
- Create: `scripts/generate-sector-seed.js`
- Create (generado): `src/db/seeders/20261007000004-seed-sector-churches.js`
- Create (generado, fuera del repo): `/Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt`

**Interfaces:**
- Consumes: tabla `SectorChurches` de la Task 2.
- Produces: diez filas en `SectorChurches` y un archivo de claves en texto plano fuera de los repositorios.

Las claves no pueden escribirse en este plan ni en el repositorio. Por eso el seeder lo genera un script: crea una clave al azar por iglesia, escribe los hashes en el seeder y las claves en un archivo aparte.

- [ ] **Step 1: Crear el generador**

Crear `scripts/generate-sector-seed.js`:

```js
'use strict';

// Genera una clave al azar por iglesia del sector.
// Escribe los hashes en el seeder (se versiona) y las claves en texto plano
// en el archivo indicado, que debe estar fuera del repositorio.
//
// Uso: node scripts/generate-sector-seed.js <ruta-archivo-claves>

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const CHURCHES = [
  'San Fabián',
  'Coihueco',
  'San Carlos',
  'San Nicolás',
  'El Carmen',
  'Pueblo Seco',
  'Tres Esquinas',
  'Bulnes',
  'San Miguel',
  'San Ignacio',
];

// Sin caracteres que se confunden al leerlos o dictarlos (0/O, 1/I/L).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const randomPassword = () => {
  const groups = [];
  for (let g = 0; g < 3; g++) {
    let group = '';
    for (let i = 0; i < 4; i++) {
      group += ALPHABET[crypto.randomInt(ALPHABET.length)];
    }
    groups.push(group);
  }
  return groups.join('-');
};

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const outArg = process.argv[2];
if (!outArg) fail('Uso: node scripts/generate-sector-seed.js <ruta-archivo-claves>');

const repoRoot = path.resolve(__dirname, '..');
const outFile = path.resolve(outArg);
const seederFile = path.join(repoRoot, 'src', 'db', 'seeders', '20261007000004-seed-sector-churches.js');

if (outFile === repoRoot || outFile.startsWith(repoRoot + path.sep)) {
  fail('El archivo de claves debe quedar fuera del repositorio.');
}
if (fs.existsSync(outFile)) {
  fail(`Ya existe ${outFile}. No se sobrescribe: bórralo a mano si quieres regenerar las claves.`);
}
if (fs.existsSync(seederFile)) {
  fail(`Ya existe ${seederFile}. Regenerarlo dejaría claves entregadas que ya no sirven.`);
}

const entries = CHURCHES.map((name) => {
  const password = randomPassword();
  return { name, password, hash: bcrypt.hashSync(password, 10) };
});

const seeder = `'use strict';

// Generado por scripts/generate-sector-seed.js. Contiene solo hashes bcrypt.

const CHURCHES = [
${entries.map((e) => `  { name: ${JSON.stringify(e.name)}, password: ${JSON.stringify(e.hash)} },`).join('\n')}
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert(
      'SectorChurches',
      CHURCHES.map((church) => ({ ...church, createdAt: now, updatedAt: now })),
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('SectorChurches', { name: CHURCHES.map((church) => church.name) }, {});
  }
};
`;

const width = Math.max(...entries.map((e) => e.name.length));
const plain = [
  'Claves iniciales de las iglesias del sector',
  `Generadas: ${new Date().toISOString()}`,
  'Cada pastor puede cambiar la suya en Mi Perfil.',
  '',
  ...entries.map((e) => `${e.name.padEnd(width)}  ${e.password}`),
  '',
].join('\n');

fs.writeFileSync(seederFile, seeder);
fs.writeFileSync(outFile, plain, { mode: 0o600 });

console.log(`Seeder escrito en ${seederFile}`);
console.log(`Claves escritas en ${outFile}`);
```

- [ ] **Step 2: Generar el seeder y el archivo de claves**

```bash
node scripts/generate-sector-seed.js /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt
```

Expected: dos líneas, `Seeder escrito en ...` y `Claves escritas en ...`.

- [ ] **Step 3: Verificar que el seeder no contiene claves en texto plano**

```bash
grep -c '\$2[aby]\$10\$' src/db/seeders/20261007000004-seed-sector-churches.js
```

Expected: `10`.

```bash
grep -oE '[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$' /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt | wc -l
grep -oE '[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$' /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt \
  | while read -r clave; do grep -c -- "$clave" src/db/seeders/20261007000004-seed-sector-churches.js; done | sort -u
```

Expected: el primer comando imprime `10` (hay diez claves en el archivo); el segundo imprime una sola línea, `0` (ninguna clave aparece en el seeder).

Verificar también que el script se niega a sobrescribir:

```bash
node scripts/generate-sector-seed.js /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt; echo "exit=$?"
```

Expected: `Ya existe ...` y `exit=1`.

- [ ] **Step 4: Ejecutar el seed**

```bash
pnpm db:seed:sector
docker exec impch-postgres psql -U postgres -d impch_db -c 'SELECT id, name FROM "SectorChurches" ORDER BY id'
```

Expected: diez filas: San Fabián, Coihueco, San Carlos, San Nicolás, El Carmen, Pueblo Seco, Tres Esquinas, Bulnes, San Miguel, San Ignacio.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-sector-seed.js src/db/seeders/20261007000004-seed-sector-churches.js
git status --short
```

Expected: `git status` no muestra `claves-sector.txt` (está fuera del repo).

```bash
git commit -m "feat: seed de las diez iglesias del sector"
```

---

### Task 4: Login de iglesia

**Files:**
- Create: `src/auth/sectorAuth.service.ts`
- Modify: `src/auth/auth.controller.ts`
- Modify: `src/auth/auth.router.ts`
- Test: `src/auth/sectorAuth.service.test.ts`

**Interfaces:**
- Consumes: `SectorChurch` (Task 2), `generateSectorToken(sectorChurchId: number, name: string): string` (Task 1).
- Produces:
  - `listSectorChurches(): Promise<{ id: number; name: string }[]>`
  - `loginSector(sectorChurchId: unknown, password: unknown): Promise<string>` — devuelve el token o lanza `Error('Credenciales inválidas')`.
  - `GET /auth/sector-churches` → `200 [{ "id": 1, "name": "Bulnes" }, ...]`
  - `POST /auth/sector-login` con `{ "sectorChurchId": 1, "password": "..." }` → `200 { "token": "..." }` o `401 { "message": "Credenciales inválidas" }`

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/auth/sectorAuth.service.test.ts`:

```ts
import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SectorChurch from '../db/models/sectorChurch.model';
import { loginSector, listSectorChurches } from './sectorAuth.service';

process.env.SECRET_KEY = 'test-secret';

const church = { id: 3, name: 'Bulnes', password: bcrypt.hashSync('ABCD-EFGH-JKMN', 4) };

afterEach(() => mock.restoreAll());

test('clave correcta devuelve un token con el rol y la iglesia', async () => {
    mock.method(SectorChurch, 'findByPk', async () => church as any);

    const token = await loginSector(3, 'ABCD-EFGH-JKMN');
    const decoded = jwt.verify(token, 'test-secret') as Record<string, unknown>;

    assert.equal(decoded.sectorChurchId, 3);
    assert.equal(decoded.username, 'Bulnes');
    assert.deepEqual(decoded.roles, ['PastorSector']);
});

test('el id puede llegar como texto desde el formulario', async () => {
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => church as any);

    await loginSector('3', 'ABCD-EFGH-JKMN');

    assert.equal(findByPk.mock.calls[0].arguments[0], 3);
});

test('clave incorrecta e iglesia inexistente devuelven el mismo error', async () => {
    mock.method(SectorChurch, 'findByPk', async () => church as any);
    await assert.rejects(loginSector(3, 'otra-clave'), { message: 'Credenciales inválidas' });

    mock.restoreAll();
    mock.method(SectorChurch, 'findByPk', async () => null);
    await assert.rejects(loginSector(99, 'ABCD-EFGH-JKMN'), { message: 'Credenciales inválidas' });
});

test('un cuerpo mal formado se rechaza sin consultar la base', async () => {
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => church as any);

    const malformed: [unknown, unknown][] = [
        [undefined, 'ABCD-EFGH-JKMN'],
        ['abc', 'ABCD-EFGH-JKMN'],
        [0, 'ABCD-EFGH-JKMN'],
        [-3, 'ABCD-EFGH-JKMN'],
        [3.5, 'ABCD-EFGH-JKMN'],
        [3, undefined],
        [3, ''],
        [3, 12345678],
        [3, { $ne: null }],
        [{ id: 3 }, 'ABCD-EFGH-JKMN'],
    ];

    for (const [id, password] of malformed) {
        await assert.rejects(loginSector(id, password), { message: 'Credenciales inválidas' });
    }
    assert.equal(findByPk.mock.callCount(), 0);
});

test('la lista pública solo pide id y nombre, ordenada por nombre', async () => {
    const findAll = mock.method(SectorChurch, 'findAll', async () => []);

    await listSectorChurches();

    const options = findAll.mock.calls[0].arguments[0] as any;
    assert.deepEqual(options.attributes, ['id', 'name']);
    assert.deepEqual(options.order, [['name', 'ASC']]);
});
```

- [ ] **Step 2: Ejecutar los tests y verificar que fallan**

Run: `pnpm test`
Expected: FAIL con `Cannot find module './sectorAuth.service'`.

- [ ] **Step 3: Implementar el servicio**

Crear `src/auth/sectorAuth.service.ts`:

```ts
import bcrypt from 'bcryptjs';
import SectorChurch from '../db/models/sectorChurch.model';
import { generateSectorToken } from '../utils/auth';
import logger from '../utils/logger';

const INVALID_CREDENTIALS = 'Credenciales inválidas';

// Se compara contra este hash cuando la iglesia no existe, para que la
// respuesta tarde lo mismo que con una clave incorrecta.
const DUMMY_HASH = bcrypt.hashSync('sin-iglesia', 10);

const listSectorChurches = async (): Promise<{ id: number; name: string }[]> => {
    const churches = await SectorChurch.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    });
    return churches.map((church) => ({ id: church.id, name: church.name }));
};

const loginSector = async (sectorChurchId: unknown, password: unknown): Promise<string> => {
    const operation = 'Auth - SectorLogin';
    logger.logStart(operation);

    try {
        const isIdLike = typeof sectorChurchId === 'number' || typeof sectorChurchId === 'string';
        const id = isIdLike ? Number(sectorChurchId) : NaN;
        if (!Number.isInteger(id) || id <= 0 || typeof password !== 'string' || password.length === 0) {
            throw new Error(INVALID_CREDENTIALS);
        }

        const church = await SectorChurch.findByPk(id);
        const valid = bcrypt.compareSync(password, church?.password ?? DUMMY_HASH);
        if (!church || !valid) {
            throw new Error(INVALID_CREDENTIALS);
        }

        logger.logAuthUsername(operation, church.name);
        return generateSectorToken(church.id, church.name);
    } catch (error: any) {
        logger.logError(operation, error.message || error);
        throw error;
    } finally {
        logger.logEnd(operation);
    }
};

export { listSectorChurches, loginSector };
```

- [ ] **Step 4: Ejecutar los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, 20 tests.

- [ ] **Step 5: Controlador y rutas**

Reemplazar `src/auth/auth.controller.ts` completo. El cambio en `loginController` es quitar `console.log(req.body)`, que imprimía la contraseña en texto plano:

```ts
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { login } from './auth.service';
import { listSectorChurches, loginSector } from './sectorAuth.service';

const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        let token = await login(username, password);
        token = token.replace(/"/g, '');
        res.send({ token });
    } catch (error: any) {
        logger.logError("Auth - Login", error.message);
        res.status(401).send(error.message);
    }
};

const sectorChurchesController = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.send(await listSectorChurches());
    } catch (error: any) {
        logger.logError("Auth - SectorChurches", error.message);
        res.status(500).send({ message: 'No se pudo cargar la lista de iglesias' });
    }
};

const sectorLoginController = async (req: Request, res: Response): Promise<void> => {
    const { sectorChurchId, password } = req.body ?? {};
    try {
        const token = await loginSector(sectorChurchId, password);
        res.send({ token });
    } catch {
        // loginSector ya registró el motivo; al cliente siempre el mismo mensaje.
        res.status(401).send({ message: 'Credenciales inválidas' });
    }
};

export { loginController, sectorChurchesController, sectorLoginController };
```

Reemplazar `src/auth/auth.router.ts` completo:

```ts
import express, { Router } from 'express';
import { loginController, sectorChurchesController, sectorLoginController } from './auth.controller';

const router: Router = express.Router();

router.post('/login', loginController);
router.get('/sector-churches', sectorChurchesController);
router.post('/sector-login', sectorLoginController);

export default router;
```

- [ ] **Step 6: Verificar contra el servidor real**

Run: `pnpm build`
Expected: compila sin errores.

En una terminal: `pnpm dev`. En otra:

```bash
curl -s http://localhost:4000/auth/sector-churches
```

Expected: JSON con diez objetos `{ "id", "name" }` ordenados por nombre (Bulnes primero), sin ningún otro campo.

```bash
ID=$(curl -s http://localhost:4000/auth/sector-churches | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).find(c=>c.name==='Bulnes').id))")
CLAVE=$(grep '^Bulnes' /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt | awk '{print $NF}')
curl -s -X POST http://localhost:4000/auth/sector-login -H 'Content-Type: application/json' \
  -d "{\"sectorChurchId\": $ID, \"password\": \"$CLAVE\"}"
```

Expected: `{"token":"eyJ..."}`.

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:4000/auth/sector-login \
  -H 'Content-Type: application/json' -d "{\"sectorChurchId\": $ID, \"password\": \"mala\"}"
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:4000/auth/sector-login \
  -H 'Content-Type: application/json' -d '{}'
```

Expected: `401` y `401`.

Revisa la salida de `pnpm dev`: no debe aparecer la clave en ninguna línea.

- [ ] **Step 7: Commit**

```bash
git add src/auth/sectorAuth.service.ts src/auth/sectorAuth.service.test.ts src/auth/auth.controller.ts src/auth/auth.router.ts
git commit -m "feat: login de iglesias del sector y quitar log del cuerpo del login"
```

---

### Task 5: Perfil de la iglesia (GraphQL `SectorChurch`)

**Files:**
- Create: `src/services/sectorChurch.service.ts`
- Create: `src/graphql/resolvers/sector.util.ts`
- Create: `src/graphql/typeDefs/sectorChurch.typeDef.ts`
- Create: `src/graphql/resolvers/sectorChurch.resolver.ts`
- Modify: `src/graphql/typeDefs.ts`
- Modify: `src/graphql/resolvers.ts`
- Test: `src/services/sectorChurch.service.test.ts`

**Interfaces:**
- Consumes: `SectorChurch` (Task 2); `validateContext`, `isAdmin`, `isSectorPastor`, `sectorScope` (Task 1).
- Produces (desde `src/services/sectorChurch.service.ts`):
  - `ServiceResponse = { code: number; message: string }`
  - `getAllSectorChurches(): Promise<SectorChurch[]>` — sin `password`.
  - `getSectorChurchById(id: number): Promise<SectorChurch | null>` — sin `password`.
  - `updateSectorChurchProfile(id: number, data: { pastor?: unknown; address?: unknown; phone?: unknown }): Promise<ServiceResponse>`
  - `changeSectorChurchPassword(id: number, currentPassword: unknown, newPassword: unknown): Promise<ServiceResponse>`
- Produces (desde `src/graphql/resolvers/sector.util.ts`), usados por las Tasks 6 y 7:
  - `runSector<T>(operation: string, service: string, context: GraphQLContext, fn: () => Promise<T>): Promise<T>`
  - `arg(parent: any, args: any, name: string): any`
- Produces (GraphQL):
  - `Query.SectorChurch { getAll: [SectorChurch]  me: SectorChurch }`
  - `Mutation.SectorChurch { updateProfile(pastor, address, phone): Response  changePassword(currentPassword!, newPassword!): Response }`
  - `type SectorChurch { id: ID!  name: String!  pastor: String  address: String  phone: String }`

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/services/sectorChurch.service.test.ts`:

```ts
import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import SectorChurch from '../db/models/sectorChurch.model';
import {
    changeSectorChurchPassword,
    getAllSectorChurches,
    getSectorChurchById,
    updateSectorChurchProfile,
} from './sectorChurch.service';

afterEach(() => mock.restoreAll());

const fakeChurch = () => {
    const church: any = { id: 3, name: 'Bulnes', password: bcrypt.hashSync('clave-actual', 4) };
    church.update = mock.fn(async (values: any) => { Object.assign(church, values); });
    return church;
};

test('las lecturas nunca traen la clave', async () => {
    const findAll = mock.method(SectorChurch, 'findAll', async () => []);
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => null);

    await getAllSectorChurches();
    await getSectorChurchById(3);

    assert.deepEqual((findAll.mock.calls[0].arguments[0] as any).attributes, { exclude: ['password'] });
    assert.deepEqual((findByPk.mock.calls[0].arguments[1] as any).attributes, { exclude: ['password'] });
});

test('cambiar la clave con la actual correcta guarda un hash de la nueva', async () => {
    const church = fakeChurch();
    mock.method(SectorChurch, 'findByPk', async () => church);

    const response = await changeSectorChurchPassword(3, 'clave-actual', 'clave-nueva-1');

    assert.equal(response.code, 200);
    assert.equal(church.update.mock.callCount(), 1);
    assert.notEqual(church.password, 'clave-nueva-1');
    assert.equal(bcrypt.compareSync('clave-nueva-1', church.password), true);
});

test('con la clave actual incorrecta no se cambia nada', async () => {
    const church = fakeChurch();
    mock.method(SectorChurch, 'findByPk', async () => church);

    const response = await changeSectorChurchPassword(3, 'no-es', 'clave-nueva-1');

    assert.deepEqual(response, { code: 400, message: 'Clave actual incorrecta' });
    assert.equal(church.update.mock.callCount(), 0);
});

test('una clave nueva de menos de 8 caracteres se rechaza sin consultar la base', async () => {
    const findByPk = mock.method(SectorChurch, 'findByPk', async () => fakeChurch());

    for (const nueva of ['1234567', '', undefined, 12345678]) {
        const response = await changeSectorChurchPassword(3, 'clave-actual', nueva);
        assert.equal(response.code, 400);
        assert.match(response.message, /al menos 8 caracteres/);
    }
    assert.equal(findByPk.mock.callCount(), 0);
});

test('el perfil solo actualiza pastor, dirección y teléfono', async () => {
    const update = mock.method(SectorChurch, 'update', async () => [1]);

    const response = await updateSectorChurchProfile(3, {
        pastor: '  Juan Pérez  ',
        address: 'Calle 1',
        phone: '',
        name: 'Otra',
        password: 'x',
    } as any);

    assert.equal(response.code, 200);
    assert.deepEqual(update.mock.calls[0].arguments[0], { pastor: 'Juan Pérez', address: 'Calle 1', phone: null });
    assert.deepEqual((update.mock.calls[0].arguments[1] as any).where, { id: 3 });
});

test('el perfil rechaza valores que no son texto, demasiado largos o un envío vacío', async () => {
    const update = mock.method(SectorChurch, 'update', async () => [1]);

    assert.equal((await updateSectorChurchProfile(3, { pastor: 'a'.repeat(256) })).code, 400);
    assert.equal((await updateSectorChurchProfile(3, { phone: 123 })).code, 400);
    assert.equal((await updateSectorChurchProfile(3, {})).code, 400);
    assert.equal(update.mock.callCount(), 0);
});

test('actualizar el perfil de una iglesia que no existe devuelve 404', async () => {
    mock.method(SectorChurch, 'update', async () => [0]);

    assert.equal((await updateSectorChurchProfile(99, { pastor: 'Juan' })).code, 404);
});
```

- [ ] **Step 2: Ejecutar los tests y verificar que fallan**

Run: `pnpm test`
Expected: FAIL con `Cannot find module './sectorChurch.service'`.

- [ ] **Step 3: Implementar el servicio**

Crear `src/services/sectorChurch.service.ts`:

```ts
import bcrypt from 'bcryptjs';
import SectorChurch from '../db/models/sectorChurch.model';

export interface ServiceResponse {
    code: number;
    message: string;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_FIELD_LENGTH = 255;
const PROFILE_FIELDS = ['pastor', 'address', 'phone'] as const;

type ProfileField = typeof PROFILE_FIELDS[number];
type ProfileInput = Partial<Record<ProfileField, unknown>>;

const WITHOUT_PASSWORD = { exclude: ['password'] };

const getAllSectorChurches = async (): Promise<SectorChurch[]> => {
    return await SectorChurch.findAll({
        attributes: WITHOUT_PASSWORD,
        order: [['name', 'ASC']],
    });
};

const getSectorChurchById = async (id: number): Promise<SectorChurch | null> => {
    return await SectorChurch.findByPk(id, { attributes: WITHOUT_PASSWORD });
};

const updateSectorChurchProfile = async (id: number, data: ProfileInput): Promise<ServiceResponse> => {
    const values: Partial<Record<ProfileField, string | null>> = {};

    for (const field of PROFILE_FIELDS) {
        const value = data[field];
        if (value === undefined) continue;
        if (value === null) {
            values[field] = null;
            continue;
        }
        if (typeof value !== 'string' || value.length > MAX_FIELD_LENGTH) {
            return { code: 400, message: `Valor inválido para ${field}` };
        }
        const trimmed = value.trim();
        values[field] = trimmed === '' ? null : trimmed;
    }

    if (Object.keys(values).length === 0) {
        return { code: 400, message: 'No hay datos para actualizar' };
    }

    const [updatedRows] = await SectorChurch.update(values, { where: { id } });
    if (updatedRows === 0) {
        return { code: 404, message: 'Iglesia no encontrada' };
    }
    return { code: 200, message: 'Perfil actualizado exitosamente' };
};

const changeSectorChurchPassword = async (id: number, currentPassword: unknown, newPassword: unknown): Promise<ServiceResponse> => {
    if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
        return { code: 400, message: `La nueva clave debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` };
    }

    const church = await SectorChurch.findByPk(id);
    if (!church) {
        return { code: 404, message: 'Iglesia no encontrada' };
    }
    if (typeof currentPassword !== 'string' || !bcrypt.compareSync(currentPassword, church.password)) {
        return { code: 400, message: 'Clave actual incorrecta' };
    }

    await church.update({ password: bcrypt.hashSync(newPassword, 10) });
    return { code: 200, message: 'Clave cambiada exitosamente' };
};

export {
    getAllSectorChurches,
    getSectorChurchById,
    updateSectorChurchProfile,
    changeSectorChurchPassword,
};
```

- [ ] **Step 4: Ejecutar los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, 27 tests.

- [ ] **Step 5: Helper compartido de los resolvers de sector**

Crear `src/graphql/resolvers/sector.util.ts`:

```ts
import { validateContext } from '../../utils/tokensLogs';
import logger from '../../utils/logger';
import { GraphQLContext } from '../types';

// Envuelve un resolver de sector: registra inicio y fin, valida el acceso al
// servicio y propaga los errores. No registra los argumentos porque pueden
// traer claves.
export const runSector = async <T>(
    operation: string,
    service: string,
    context: GraphQLContext,
    fn: () => Promise<T>
): Promise<T> => {
    logger.logStart(operation);
    logger.logUser(operation, context.user);
    try {
        validateContext(context.user, service);
        return await fn();
    } catch (error) {
        logger.logError(operation, error);
        throw error;
    } finally {
        logger.logEnd(operation);
    }
};

// bindContextToResolvers entrega los argumentos del campo en `parent` y las
// variables de la operación en `args`. Se prefieren los del campo.
export const arg = (parent: any, args: any, name: string): any => {
    return parent?.[name] ?? args?.[name];
};
```

- [ ] **Step 6: Esquema y resolver**

Crear `src/graphql/typeDefs/sectorChurch.typeDef.ts`:

```ts
import { gql } from 'graphql-tag';

const dataTypesSectorChurch = gql`
  type SectorChurchQuery {
    getAll: [SectorChurch]
    me: SectorChurch
  }

  type SectorChurchMutation {
    updateProfile(pastor: String, address: String, phone: String): Response
    changePassword(currentPassword: String!, newPassword: String!): Response
  }

  type SectorChurch {
    id: ID!
    name: String!
    pastor: String
    address: String
    phone: String
  }
`;

export default dataTypesSectorChurch;
```

Crear `src/graphql/resolvers/sectorChurch.resolver.ts`:

```ts
import * as sectorChurchService from '../../services/sectorChurch.service';
import { isAdmin, isSectorPastor, sectorScope } from '../../utils/tokensLogs';
import { GraphQLContext, GraphQLArgs } from '../types';
import { runSector, arg } from './sector.util';

const SERVICE = 'SectorChurch';

// El perfil y la clave son siempre los de la iglesia del token.
const ownChurchId = (user: any): number => {
    if (!isSectorPastor(user)) throw new Error('No autorizado');
    return sectorScope(user) as number;
};

const resolversSectorChurch = {
    SectorChurchQuery: {
        getAll: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - getAll', SERVICE, context, async () => {
                if (isSectorPastor(context.user) || !isAdmin(context.user)) throw new Error('No autorizado');
                return await sectorChurchService.getAllSectorChurches();
            }),
        me: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - me', SERVICE, context, async () => {
                return await sectorChurchService.getSectorChurchById(ownChurchId(context.user));
            }),
    },

    SectorChurchMutation: {
        updateProfile: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - updateProfile', SERVICE, context, async () => {
                return await sectorChurchService.updateSectorChurchProfile(ownChurchId(context.user), {
                    pastor: arg(parent, args, 'pastor'),
                    address: arg(parent, args, 'address'),
                    phone: arg(parent, args, 'phone'),
                });
            }),
        changePassword: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorChurch - changePassword', SERVICE, context, async () => {
                return await sectorChurchService.changeSectorChurchPassword(
                    ownChurchId(context.user),
                    arg(parent, args, 'currentPassword'),
                    arg(parent, args, 'newPassword')
                );
            }),
    },
};

export default resolversSectorChurch;
```

- [ ] **Step 7: Registrar el namespace**

En `src/graphql/typeDefs.ts`:

Después de `import dataTypesExpense from './typeDefs/expense.typeDef';`:

```ts
import dataTypesSectorChurch from './typeDefs/sectorChurch.typeDef';
```

Después de `${dataTypesExpense}`:

```
    ${dataTypesSectorChurch}
```

Dentro de `type Query { ... }`, después de `Expense: ExpenseQuery`:

```
        SectorChurch: SectorChurchQuery
```

Dentro de `type Mutation { ... }`, después de `Expense: ExpenseMutation`:

```
        SectorChurch: SectorChurchMutation
```

En `src/graphql/resolvers.ts`:

Después de `import resolverExpense from './resolvers/expense.resolver';`:

```ts
import resolverSectorChurch from './resolvers/sectorChurch.resolver';
```

Dentro de `Query: { ... }`, después del bloque `Expense`:

```ts
        SectorChurch: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverSectorChurch.SectorChurchQuery, context);
        },
```

Dentro de `Mutation: { ... }`, después del bloque `Expense`:

```ts
        SectorChurch: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverSectorChurch.SectorChurchMutation, context);
        },
```

- [ ] **Step 8: Verificar contra el servidor real**

Run: `pnpm build`
Expected: compila sin errores.

Con `pnpm dev` corriendo, obtener un token de pastor y uno de administrador:

```bash
ID=$(curl -s http://localhost:4000/auth/sector-churches | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).find(c=>c.name==='Bulnes').id))")
CLAVE=$(grep '^Bulnes' /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt | awk '{print $NF}')
PASTOR=$(curl -s -X POST http://localhost:4000/auth/sector-login -H 'Content-Type: application/json' \
  -d "{\"sectorChurchId\": $ID, \"password\": \"$CLAVE\"}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).token))")
ADMIN=$(node -r ts-node/register -e "console.log(require('./src/utils/auth').generateToken(1,'hugo','a@a.cl','18.156.271-4',['Administrador'],1))")
gql() { curl -s http://localhost:4000/graphql -H 'Content-Type: application/json' -H "Authorization: Bearer $1" -d "$2"; echo; }
```

```bash
gql "$PASTOR" '{"query":"{ SectorChurch { me { id name pastor address phone } } }"}'
```

Expected: `{"data":{"SectorChurch":{"me":{"id":"...","name":"Bulnes","pastor":null,"address":null,"phone":null}}}}`.

```bash
gql "$PASTOR" '{"query":"{ SectorChurch { getAll { id name } } }"}'
gql "$ADMIN"  '{"query":"{ SectorChurch { getAll { id name } } }"}'
gql "$ADMIN"  '{"query":"{ SectorChurch { me { id } } }"}'
```

Expected: la primera y la tercera devuelven un error `No autorizado`; la segunda devuelve las diez iglesias.

```bash
gql "$PASTOR" '{"query":"{ Offering { getAll { id } } }"}'
gql "$PASTOR" '{"query":"{ Member { count } }"}'
gql "$PASTOR" '{"query":"{ User { getAll { id username } } }"}'
```

Expected: las tres devuelven `No autorizado` y ningún dato.

```bash
gql "$PASTOR" '{"query":"mutation($pastor:String,$address:String,$phone:String){ SectorChurch { updateProfile(pastor:$pastor,address:$address,phone:$phone){ code message } } }","variables":{"pastor":"Juan Pérez","address":"Calle 1","phone":"+56 9 1234 5678"}}'
gql "$PASTOR" '{"query":"{ SectorChurch { me { pastor address phone } } }"}'
```

Expected: `code 200` y luego los tres valores guardados.

- [ ] **Step 9: Commit**

```bash
git add src/services/sectorChurch.service.ts src/services/sectorChurch.service.test.ts \
        src/graphql/resolvers/sector.util.ts src/graphql/typeDefs/sectorChurch.typeDef.ts \
        src/graphql/resolvers/sectorChurch.resolver.ts src/graphql/typeDefs.ts src/graphql/resolvers.ts
git commit -m "feat: perfil y cambio de clave de las iglesias del sector"
```

---

### Task 6: Bautizos del sector (GraphQL `SectorBaptismRecord`)

**Files:**
- Create: `src/services/sectorBaptismRecord.service.ts`
- Create: `src/graphql/typeDefs/sectorBaptismRecord.typeDef.ts`
- Create: `src/graphql/resolvers/sectorBaptismRecord.resolver.ts`
- Modify: `src/graphql/typeDefs.ts`
- Modify: `src/graphql/resolvers.ts`
- Test: `src/services/sectorBaptismRecord.service.test.ts`

**Interfaces:**
- Consumes:
  - `SectorBaptismRecord`, `SectorChurch` (Task 2).
  - `sectorScope(user, requested?): number | undefined`, `isSectorPastor(user): boolean` (Task 1).
  - `runSector(operation, service, context, fn)`, `arg(parent, args, name)` (Task 5).
  - `input BaptismRecordInput` ya existente en `src/graphql/typeDefs/baptismRecord.typeDef.ts`.
- Produces (desde el servicio). En todas, `scopeId: number | undefined` es el resultado de `sectorScope`; `undefined` significa todas las iglesias:
  - `getAllSectorBaptisms(scopeId): Promise<object[]>` — cada objeto incluye `sectorChurchName`.
  - `getSectorBaptismById(id: unknown, scopeId): Promise<object | null>`
  - `countSectorBaptisms(scopeId): Promise<number>`
  - `createSectorBaptism(data: any, sectorChurchId: number): Promise<ServiceResponse>`
  - `updateSectorBaptism(id: unknown, data: any, scopeId): Promise<ServiceResponse>`
  - `deleteSectorBaptism(id: unknown, scopeId): Promise<ServiceResponse>`
- Produces (GraphQL):
  - `Query.SectorBaptismRecord { getAll(sectorChurchId: ID): [SectorBaptismRecord]  getById(id: ID!): SectorBaptismRecord  count: Int }`
  - `Mutation.SectorBaptismRecord { create(baptismRecord: BaptismRecordInput!): Response  update(id: ID!, baptismRecord: BaptismRecordInput!): Response  delete(id: ID!): Response }`

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/services/sectorBaptismRecord.service.test.ts`:

```ts
import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import SectorBaptismRecord from '../db/models/sectorBaptismRecord.model';
import {
    countSectorBaptisms,
    createSectorBaptism,
    deleteSectorBaptism,
    getAllSectorBaptisms,
    getSectorBaptismById,
    updateSectorBaptism,
} from './sectorBaptismRecord.service';

afterEach(() => mock.restoreAll());

const valid = () => ({
    childRUT: '25.111.222-3',
    childFullName: 'Ana Soto',
    childDateOfBirth: new Date('2024-01-10T12:00:00'),
    fatherRUT: '',
    fatherFullName: '',
    motherRUT: '15.111.222-3',
    motherFullName: 'María Soto',
    placeOfRegistration: 'Bulnes',
    baptismDate: new Date('2026-09-20T12:00:00'),
    registrationNumber: '123',
    registrationDate: new Date('2024-01-15T12:00:00'),
});

const whereOf = (call: { arguments: unknown[] }, index = 0) => (call.arguments[index] as any).where;

test('listar y contar filtran por la iglesia del alcance', async () => {
    const findAll = mock.method(SectorBaptismRecord, 'findAll', async () => []);
    const count = mock.method(SectorBaptismRecord, 'count', async () => 0);

    await getAllSectorBaptisms(3);
    await countSectorBaptisms(3);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
    assert.deepEqual(whereOf(count.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
});

test('sin alcance (administrador) no se filtra por iglesia', async () => {
    const findAll = mock.method(SectorBaptismRecord, 'findAll', async () => []);

    await getAllSectorBaptisms(undefined);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false });
});

test('leer por id busca por id y por iglesia', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);

    assert.equal(await getSectorBaptismById('5', 3), null);
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('editar un registro de otra iglesia devuelve 404 y no modifica nada', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const update = mock.method(SectorBaptismRecord, 'update', async () => [0]);

    const response = await updateSectorBaptism(5, valid(), 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { id: 5, deleted: false, sectorChurchId: 3 });
    assert.equal(update.mock.callCount(), 0);
});

test('eliminar un registro de otra iglesia devuelve 404', async () => {
    const update = mock.method(SectorBaptismRecord, 'update', async () => [0]);

    const response = await deleteSectorBaptism(5, 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(update.mock.calls[0].arguments[0], { deleted: true });
    assert.deepEqual(whereOf(update.mock.calls[0], 1), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('un id que no es un entero positivo devuelve 404 sin consultar la base', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const update = mock.method(SectorBaptismRecord, 'update', async () => [1]);

    for (const id of ['abc', 0, -1, undefined, null, '5; DROP']) {
        assert.equal((await updateSectorBaptism(id, valid(), 3)).code, 404);
        assert.equal((await deleteSectorBaptism(id, 3)).code, 404);
        assert.equal(await getSectorBaptismById(id, 3), null);
    }
    assert.equal(findOne.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
});

test('crear guarda con la iglesia indicada e ignora campos que no son del bautizo', async () => {
    mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);

    const response = await createSectorBaptism({ ...valid(), sectorChurchId: 9, deleted: true, id: 77 }, 3);

    assert.equal(response.code, 201);
    const saved = create.mock.calls[0].arguments[0] as any;
    assert.equal(saved.sectorChurchId, 3);
    assert.equal('deleted' in saved, false);
    assert.equal('id' in saved, false);
    assert.equal(saved.fatherRUT, null);
    assert.equal(saved.fatherFullName, null);
});

test('crear con un campo obligatorio vacío devuelve 400 y no inserta', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => null);
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);

    const sinFecha = await createSectorBaptism({ ...valid(), baptismDate: null }, 3);
    const sinMadre = await createSectorBaptism({ ...valid(), motherRUT: '   ' }, 3);
    const sinDatos = await createSectorBaptism(undefined, 3);

    assert.deepEqual(sinFecha, { code: 400, message: 'Campo requerido faltante: baptismDate' });
    assert.deepEqual(sinMadre, { code: 400, message: 'Campo requerido faltante: motherRUT' });
    assert.equal(sinDatos.code, 400);
    assert.equal(findOne.mock.callCount(), 0);
    assert.equal(create.mock.callCount(), 0);
});

test('crear un RUT que ya tiene bautizo activo en el sector devuelve 400', async () => {
    const findOne = mock.method(SectorBaptismRecord, 'findOne', async () => ({ id: 1 }) as any);
    const create = mock.method(SectorBaptismRecord, 'create', async () => ({}) as any);

    const response = await createSectorBaptism(valid(), 3);

    assert.deepEqual(response, { code: 400, message: 'Registro de bautizo ya existe para este RUT' });
    // La búsqueda de duplicados es en todo el sector, no solo en la iglesia.
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { childRUT: '25.111.222-3', deleted: false });
    assert.equal(create.mock.callCount(), 0);
});

test('si dos peticiones crean el mismo RUT a la vez, el índice único se traduce a 400', async () => {
    mock.method(SectorBaptismRecord, 'findOne', async () => null);
    mock.method(SectorBaptismRecord, 'create', async () => {
        const error: any = new Error('Validation error');
        error.name = 'SequelizeUniqueConstraintError';
        throw error;
    });

    const response = await createSectorBaptism(valid(), 3);

    assert.deepEqual(response, { code: 400, message: 'Registro de bautizo ya existe para este RUT' });
});

test('editar cambiando el RUT a uno que ya existe devuelve 400', async () => {
    const record: any = { id: 5, childRUT: '25.111.222-3', update: mock.fn(async () => undefined) };
    let calls = 0;
    mock.method(SectorBaptismRecord, 'findOne', async () => (calls++ === 0 ? record : ({ id: 8 } as any)));

    const response = await updateSectorBaptism(5, { ...valid(), childRUT: '26.000.000-1' }, 3);

    assert.deepEqual(response, { code: 400, message: 'Registro de bautizo ya existe para este RUT' });
    assert.equal(record.update.mock.callCount(), 0);
});

test('editar un registro propio lo actualiza sin cambiar su iglesia', async () => {
    const record: any = { id: 5, childRUT: '25.111.222-3', update: mock.fn(async () => undefined) };
    mock.method(SectorBaptismRecord, 'findOne', async () => record);

    const response = await updateSectorBaptism(5, { ...valid(), childFullName: 'Ana Soto Díaz', sectorChurchId: 9 }, 3);

    assert.equal(response.code, 200);
    const saved = record.update.mock.calls[0].arguments[0];
    assert.equal(saved.childFullName, 'Ana Soto Díaz');
    assert.equal('sectorChurchId' in saved, false);
});
```

- [ ] **Step 2: Ejecutar los tests y verificar que fallan**

Run: `pnpm test`
Expected: FAIL con `Cannot find module './sectorBaptismRecord.service'`.

- [ ] **Step 3: Implementar el servicio**

Crear `src/services/sectorBaptismRecord.service.ts`:

```ts
import { Op } from 'sequelize';
import SectorBaptismRecord from '../db/models/sectorBaptismRecord.model';
import SectorChurch from '../db/models/sectorChurch.model';
import logger from '../utils/logger';

export interface ServiceResponse {
    code: number;
    message: string;
}

interface BaptismFields {
    childRUT: string;
    childFullName: string;
    childDateOfBirth: Date;
    fatherRUT: string | null;
    fatherFullName: string | null;
    motherRUT: string;
    motherFullName: string;
    placeOfRegistration: string;
    baptismDate: Date;
    registrationNumber: string;
    registrationDate: Date;
}

const REQUIRED_FIELDS: (keyof BaptismFields)[] = [
    'childRUT', 'childFullName', 'childDateOfBirth',
    'motherRUT', 'motherFullName', 'placeOfRegistration',
    'baptismDate', 'registrationNumber', 'registrationDate',
];

const NOT_FOUND: ServiceResponse = { code: 404, message: 'Registro no encontrado' };
const DUPLICATE: ServiceResponse = { code: 400, message: 'Registro de bautizo ya existe para este RUT' };

const churchInclude = { model: SectorChurch, as: 'sectorChurch', attributes: ['name'] };

const scopedWhere = (scopeId: number | undefined) => ({
    deleted: false,
    ...(scopeId !== undefined ? { sectorChurchId: scopeId } : {}),
});

const toId = (id: unknown): number | null => {
    if (typeof id !== 'number' && typeof id !== 'string') return null;
    const n = Number(id);
    return Number.isInteger(n) && n > 0 ? n : null;
};

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const optionalText = (value: unknown): string | null => text(value) || null;

// Copia solo los campos del bautizo. Lo que no está aquí (id, deleted,
// sectorChurchId) nunca puede venir del cliente.
const pickFields = (data: any): BaptismFields => ({
    childRUT: text(data?.childRUT),
    childFullName: text(data?.childFullName),
    childDateOfBirth: data?.childDateOfBirth,
    fatherRUT: optionalText(data?.fatherRUT),
    fatherFullName: optionalText(data?.fatherFullName),
    motherRUT: text(data?.motherRUT),
    motherFullName: text(data?.motherFullName),
    placeOfRegistration: text(data?.placeOfRegistration),
    baptismDate: data?.baptismDate,
    registrationNumber: text(data?.registrationNumber),
    registrationDate: data?.registrationDate,
});

const missingField = (fields: BaptismFields): string | undefined => {
    return REQUIRED_FIELDS.find((field) => !fields[field]);
};

const toDTO = (record: SectorBaptismRecord) => {
    const plain: any = record.get({ plain: true });
    return { ...plain, sectorChurchName: plain.sectorChurch?.name ?? null };
};

const isUniqueViolation = (error: any): boolean => error?.name === 'SequelizeUniqueConstraintError';

const getAllSectorBaptisms = async (scopeId: number | undefined) => {
    const records = await SectorBaptismRecord.findAll({
        where: scopedWhere(scopeId),
        include: [churchInclude],
        order: [['createdAt', 'DESC']],
    });
    return records.map(toDTO);
};

const getSectorBaptismById = async (id: unknown, scopeId: number | undefined) => {
    const recordId = toId(id);
    if (recordId === null) return null;

    const record = await SectorBaptismRecord.findOne({
        where: { id: recordId, ...scopedWhere(scopeId) },
        include: [churchInclude],
    });
    return record ? toDTO(record) : null;
};

const countSectorBaptisms = async (scopeId: number | undefined): Promise<number> => {
    return await SectorBaptismRecord.count({ where: scopedWhere(scopeId) });
};

const createSectorBaptism = async (data: any, sectorChurchId: number): Promise<ServiceResponse> => {
    try {
        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        const existing = await SectorBaptismRecord.findOne({
            where: { childRUT: fields.childRUT, deleted: false },
        });
        if (existing) return DUPLICATE;

        await SectorBaptismRecord.create({ ...fields, sectorChurchId });
        return { code: 201, message: 'Registro de bautizo creado exitosamente' };
    } catch (error: any) {
        if (isUniqueViolation(error)) return DUPLICATE;
        logger.logError('SectorBaptismRecord - create', error);
        return { code: 500, message: 'Error interno del servidor al crear el registro de bautizo' };
    }
};

const updateSectorBaptism = async (id: unknown, data: any, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        const record = await SectorBaptismRecord.findOne({
            where: { id: recordId, ...scopedWhere(scopeId) },
        });
        if (!record) return NOT_FOUND;

        if (fields.childRUT !== record.childRUT) {
            const existing = await SectorBaptismRecord.findOne({
                where: { childRUT: fields.childRUT, deleted: false, id: { [Op.ne]: recordId } },
            });
            if (existing) return DUPLICATE;
        }

        await record.update(fields);
        return { code: 200, message: 'Registro de bautizo actualizado exitosamente' };
    } catch (error: any) {
        if (isUniqueViolation(error)) return DUPLICATE;
        logger.logError('SectorBaptismRecord - update', error);
        return { code: 500, message: 'Error interno del servidor al actualizar el registro de bautizo' };
    }
};

const deleteSectorBaptism = async (id: unknown, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const [updatedRows] = await SectorBaptismRecord.update(
            { deleted: true },
            { where: { id: recordId, ...scopedWhere(scopeId) } }
        );
        if (updatedRows === 0) return NOT_FOUND;

        return { code: 200, message: 'Registro de bautizo eliminado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorBaptismRecord - delete', error);
        return { code: 500, message: 'Error interno del servidor al eliminar el registro de bautizo' };
    }
};

export {
    getAllSectorBaptisms,
    getSectorBaptismById,
    countSectorBaptisms,
    createSectorBaptism,
    updateSectorBaptism,
    deleteSectorBaptism,
};
```

- [ ] **Step 4: Ejecutar los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, 39 tests.

- [ ] **Step 5: Esquema y resolver**

Crear `src/graphql/typeDefs/sectorBaptismRecord.typeDef.ts`. Reutiliza `BaptismRecordInput`, que ya tiene exactamente los once campos:

```ts
import { gql } from 'graphql-tag';

const dataTypesSectorBaptismRecord = gql`
  type SectorBaptismRecordQuery {
    getAll(sectorChurchId: ID): [SectorBaptismRecord]
    getById(id: ID!): SectorBaptismRecord
    count: Int
  }

  type SectorBaptismRecordMutation {
    create(baptismRecord: BaptismRecordInput!): Response
    update(id: ID!, baptismRecord: BaptismRecordInput!): Response
    delete(id: ID!): Response
  }

  type SectorBaptismRecord {
    id: ID!
    sectorChurchId: ID!
    sectorChurchName: String
    childRUT: ID!
    childFullName: String!
    childDateOfBirth: Date!
    fatherRUT: ID
    fatherFullName: String
    motherRUT: ID!
    motherFullName: String!
    placeOfRegistration: String!
    baptismDate: Date!
    registrationNumber: String!
    registrationDate: Date!
  }
`;

export default dataTypesSectorBaptismRecord;
```

Crear `src/graphql/resolvers/sectorBaptismRecord.resolver.ts`:

```ts
import * as sectorBaptismService from '../../services/sectorBaptismRecord.service';
import { isSectorPastor, sectorScope } from '../../utils/tokensLogs';
import { GraphQLContext, GraphQLArgs } from '../types';
import { runSector, arg } from './sector.util';

const SERVICE = 'SectorBaptismRecord';

const resolversSectorBaptismRecord = {
    SectorBaptismRecordQuery: {
        getAll: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - getAll', SERVICE, context, async () => {
                const scopeId = sectorScope(context.user, arg(parent, args, 'sectorChurchId'));
                return await sectorBaptismService.getAllSectorBaptisms(scopeId);
            }),
        getById: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - getById', SERVICE, context, async () => {
                return await sectorBaptismService.getSectorBaptismById(arg(parent, args, 'id'), sectorScope(context.user));
            }),
        count: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - count', SERVICE, context, async () => {
                return await sectorBaptismService.countSectorBaptisms(sectorScope(context.user));
            }),
    },

    SectorBaptismRecordMutation: {
        create: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - create', SERVICE, context, async () => {
                // Un registro siempre nace desde la cuenta de la iglesia.
                if (!isSectorPastor(context.user)) throw new Error('No autorizado');
                const sectorChurchId = sectorScope(context.user) as number;
                return await sectorBaptismService.createSectorBaptism(arg(parent, args, 'baptismRecord'), sectorChurchId);
            }),
        update: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - update', SERVICE, context, async () => {
                return await sectorBaptismService.updateSectorBaptism(
                    arg(parent, args, 'id'),
                    arg(parent, args, 'baptismRecord'),
                    sectorScope(context.user)
                );
            }),
        delete: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorBaptismRecord - delete', SERVICE, context, async () => {
                return await sectorBaptismService.deleteSectorBaptism(arg(parent, args, 'id'), sectorScope(context.user));
            }),
    },
};

export default resolversSectorBaptismRecord;
```

- [ ] **Step 6: Registrar el namespace**

En `src/graphql/typeDefs.ts`:

Después de `import dataTypesSectorChurch from './typeDefs/sectorChurch.typeDef';`:

```ts
import dataTypesSectorBaptismRecord from './typeDefs/sectorBaptismRecord.typeDef';
```

Después de `${dataTypesSectorChurch}`:

```
    ${dataTypesSectorBaptismRecord}
```

Dentro de `type Query { ... }`, después de `SectorChurch: SectorChurchQuery`:

```
        SectorBaptismRecord: SectorBaptismRecordQuery
```

Dentro de `type Mutation { ... }`, después de `SectorChurch: SectorChurchMutation`:

```
        SectorBaptismRecord: SectorBaptismRecordMutation
```

En `src/graphql/resolvers.ts`:

Después de `import resolverSectorChurch from './resolvers/sectorChurch.resolver';`:

```ts
import resolverSectorBaptismRecord from './resolvers/sectorBaptismRecord.resolver';
```

Dentro de `Query: { ... }`, después del bloque `SectorChurch`:

```ts
        SectorBaptismRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverSectorBaptismRecord.SectorBaptismRecordQuery, context);
        },
```

Dentro de `Mutation: { ... }`, después del bloque `SectorChurch`:

```ts
        SectorBaptismRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverSectorBaptismRecord.SectorBaptismRecordMutation, context);
        },
```

- [ ] **Step 7: Verificar contra el servidor real**

Run: `pnpm build`
Expected: compila sin errores.

Con `pnpm dev` corriendo y las variables `PASTOR`, `ADMIN` y la función `gql` de la Task 5 Step 8 (vuelve a definirlas si abriste otra terminal). Obtener además un token de otra iglesia:

```bash
ID2=$(curl -s http://localhost:4000/auth/sector-churches | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).find(c=>c.name==='Coihueco').id))")
CLAVE2=$(grep '^Coihueco' /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt | awk '{print $NF}')
OTRO=$(curl -s -X POST http://localhost:4000/auth/sector-login -H 'Content-Type: application/json' \
  -d "{\"sectorChurchId\": $ID2, \"password\": \"$CLAVE2\"}" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).token))")
```

Crear como Bulnes:

```bash
gql "$PASTOR" '{"query":"mutation($baptismRecord: BaptismRecordInput!){ SectorBaptismRecord { create(baptismRecord:$baptismRecord){ code message } } }","variables":{"baptismRecord":{"childRUT":"25.111.222-3","childFullName":"Ana Soto","childDateOfBirth":"2024-01-10","fatherRUT":"","fatherFullName":"","motherRUT":"15.111.222-3","motherFullName":"María Soto","placeOfRegistration":"Bulnes","baptismDate":"2026-09-20","registrationNumber":"123","registrationDate":"2024-01-15"}}}'
```

Expected: `"code":201`. Repetir el mismo comando: `"code":400` con `Registro de bautizo ya existe para este RUT`.

Listar como Bulnes, como Coihueco y como administrador:

```bash
Q='{"query":"query($sectorChurchId: ID){ SectorBaptismRecord { getAll(sectorChurchId:$sectorChurchId){ id sectorChurchName childFullName baptismDate } count } }"}'
gql "$PASTOR" "$Q"
gql "$OTRO" "$Q"
gql "$ADMIN" "$Q"
```

Expected: Bulnes ve un registro con `"baptismDate":"2026-09-20"` y `count 1`; Coihueco ve lista vacía y `count 0`; el administrador ve el registro con `"sectorChurchName":"Bulnes"`.

Coihueco pide los de Bulnes pasando su id, e intenta editar y eliminar el registro (reemplaza `1` por el `id` que devolvió el listado):

```bash
gql "$OTRO" "{\"query\":\"query(\$sectorChurchId: ID){ SectorBaptismRecord { getAll(sectorChurchId:\$sectorChurchId){ id } } }\",\"variables\":{\"sectorChurchId\":\"$ID\"}}"
gql "$OTRO" '{"query":"mutation($id: ID!){ SectorBaptismRecord { delete(id:$id){ code message } } }","variables":{"id":"1"}}'
gql "$OTRO" '{"query":"query($id: ID!){ SectorBaptismRecord { getById(id:$id){ id } } }","variables":{"id":"1"}}'
```

Expected: lista vacía; `"code":404,"message":"Registro no encontrado"`; `"getById":null`.

El administrador no puede crear y sí puede eliminar:

```bash
gql "$ADMIN" '{"query":"mutation($baptismRecord: BaptismRecordInput!){ SectorBaptismRecord { create(baptismRecord:$baptismRecord){ code } } }","variables":{"baptismRecord":{"childRUT":"26.000.000-1"}}}'
gql "$ADMIN" '{"query":"mutation($id: ID!){ SectorBaptismRecord { delete(id:$id){ code message } } }","variables":{"id":"1"}}'
```

Expected: `No autorizado`; luego `"code":200`.

- [ ] **Step 8: Commit**

```bash
git add src/services/sectorBaptismRecord.service.ts src/services/sectorBaptismRecord.service.test.ts \
        src/graphql/typeDefs/sectorBaptismRecord.typeDef.ts src/graphql/resolvers/sectorBaptismRecord.resolver.ts \
        src/graphql/typeDefs.ts src/graphql/resolvers.ts
git commit -m "feat: bautizos del sector con alcance por iglesia"
```

---

### Task 7: Matrimonios del sector (GraphQL `SectorMerriageRecord`)

**Files:**
- Create: `src/services/sectorMerriageRecord.service.ts`
- Create: `src/graphql/typeDefs/sectorMerriageRecord.typeDef.ts`
- Create: `src/graphql/resolvers/sectorMerriageRecord.resolver.ts`
- Modify: `src/graphql/typeDefs.ts`
- Modify: `src/graphql/resolvers.ts`
- Test: `src/services/sectorMerriageRecord.service.test.ts`

**Interfaces:**
- Consumes:
  - `SectorMerriageRecord`, `SectorChurch` (Task 2).
  - `sectorScope(user, requested?): number | undefined`, `isSectorPastor(user): boolean` (Task 1).
  - `runSector(operation, service, context, fn)`, `arg(parent, args, name)` (Task 5).
  - `input MerriageRecordInput` ya existente en `src/graphql/typeDefs/merriageRecord.typeDef.ts`.
- Produces (desde el servicio), con `scopeId: number | undefined` como en la Task 6:
  - `getAllSectorMerriages(scopeId): Promise<object[]>` — cada objeto incluye `sectorChurchName`.
  - `getSectorMerriageById(id: unknown, scopeId): Promise<object | null>`
  - `countSectorMerriages(scopeId): Promise<number>`
  - `createSectorMerriage(data: any, sectorChurchId: number): Promise<ServiceResponse>`
  - `updateSectorMerriage(id: unknown, data: any, scopeId): Promise<ServiceResponse>`
  - `deleteSectorMerriage(id: unknown, scopeId): Promise<ServiceResponse>`
- Produces (GraphQL):
  - `Query.SectorMerriageRecord { getAll(sectorChurchId: ID): [SectorMerriageRecord]  getById(id: ID!): SectorMerriageRecord  count: Int }`
  - `Mutation.SectorMerriageRecord { create(merriageRecord: MerriageRecordInput!): Response  update(id: ID!, merriageRecord: MerriageRecordInput!): Response  delete(id: ID!): Response }`

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/services/sectorMerriageRecord.service.test.ts`:

```ts
import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import SectorMerriageRecord from '../db/models/sectorMerriageRecord.model';
import {
    countSectorMerriages,
    createSectorMerriage,
    deleteSectorMerriage,
    getAllSectorMerriages,
    getSectorMerriageById,
    updateSectorMerriage,
} from './sectorMerriageRecord.service';

afterEach(() => mock.restoreAll());

const valid = () => ({
    husbandId: '15.111.222-3',
    fullNameHusband: 'Pedro Soto',
    wifeId: '16.111.222-3',
    fullNameWife: 'Marta Díaz',
    civilCode: 45,
    civilDate: new Date('2026-08-01T12:00:00'),
    civilPlace: 'Bulnes',
    religiousDate: new Date('2026-08-15T12:00:00'),
});

const whereOf = (call: { arguments: unknown[] }, index = 0) => (call.arguments[index] as any).where;

test('listar y contar filtran por la iglesia del alcance', async () => {
    const findAll = mock.method(SectorMerriageRecord, 'findAll', async () => []);
    const count = mock.method(SectorMerriageRecord, 'count', async () => 0);

    await getAllSectorMerriages(3);
    await countSectorMerriages(3);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
    assert.deepEqual(whereOf(count.mock.calls[0]), { deleted: false, sectorChurchId: 3 });
});

test('sin alcance (administrador) no se filtra por iglesia', async () => {
    const findAll = mock.method(SectorMerriageRecord, 'findAll', async () => []);

    await getAllSectorMerriages(undefined);

    assert.deepEqual(whereOf(findAll.mock.calls[0]), { deleted: false });
});

test('leer por id busca por id y por iglesia', async () => {
    const findOne = mock.method(SectorMerriageRecord, 'findOne', async () => null);

    assert.equal(await getSectorMerriageById('5', 3), null);
    assert.deepEqual(whereOf(findOne.mock.calls[0]), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('editar un registro de otra iglesia devuelve 404 y no modifica nada', async () => {
    const update = mock.method(SectorMerriageRecord, 'update', async () => [0]);

    const response = await updateSectorMerriage(5, valid(), 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(whereOf(update.mock.calls[0], 1), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('eliminar un registro de otra iglesia devuelve 404', async () => {
    const update = mock.method(SectorMerriageRecord, 'update', async () => [0]);

    const response = await deleteSectorMerriage(5, 3);

    assert.deepEqual(response, { code: 404, message: 'Registro no encontrado' });
    assert.deepEqual(update.mock.calls[0].arguments[0], { deleted: true });
    assert.deepEqual(whereOf(update.mock.calls[0], 1), { id: 5, deleted: false, sectorChurchId: 3 });
});

test('un id que no es un entero positivo devuelve 404 sin consultar la base', async () => {
    const findOne = mock.method(SectorMerriageRecord, 'findOne', async () => null);
    const update = mock.method(SectorMerriageRecord, 'update', async () => [1]);

    for (const id of ['abc', 0, -1, undefined, null]) {
        assert.equal((await updateSectorMerriage(id, valid(), 3)).code, 404);
        assert.equal((await deleteSectorMerriage(id, 3)).code, 404);
        assert.equal(await getSectorMerriageById(id, 3), null);
    }
    assert.equal(findOne.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
});

test('crear guarda con la iglesia indicada e ignora campos que no son del matrimonio', async () => {
    const create = mock.method(SectorMerriageRecord, 'create', async () => ({}) as any);

    const response = await createSectorMerriage({ ...valid(), sectorChurchId: 9, deleted: true, id: 77 }, 3);

    assert.equal(response.code, 201);
    const saved = create.mock.calls[0].arguments[0] as any;
    assert.equal(saved.sectorChurchId, 3);
    assert.equal(saved.civilCode, 45);
    assert.equal('deleted' in saved, false);
    assert.equal('id' in saved, false);
});

test('crear con un campo obligatorio vacío devuelve 400 y no inserta', async () => {
    const create = mock.method(SectorMerriageRecord, 'create', async () => ({}) as any);

    const sinFecha = await createSectorMerriage({ ...valid(), religiousDate: null }, 3);
    const sinEsposa = await createSectorMerriage({ ...valid(), fullNameWife: '  ' }, 3);
    const sinDatos = await createSectorMerriage(undefined, 3);

    assert.deepEqual(sinFecha, { code: 400, message: 'Campo requerido faltante: religiousDate' });
    assert.deepEqual(sinEsposa, { code: 400, message: 'Campo requerido faltante: fullNameWife' });
    assert.equal(sinDatos.code, 400);
    assert.equal(create.mock.callCount(), 0);
});

test('el número de registro debe ser un entero positivo; cero no cuenta como vacío válido', async () => {
    const create = mock.method(SectorMerriageRecord, 'create', async () => ({}) as any);

    for (const civilCode of [0, -4, 1.5, NaN, null, undefined, 'abc']) {
        const response = await createSectorMerriage({ ...valid(), civilCode }, 3);
        assert.deepEqual(response, { code: 400, message: 'Campo requerido faltante: civilCode' });
    }
    assert.equal(create.mock.callCount(), 0);
});

test('editar un registro propio lo actualiza sin cambiar su iglesia', async () => {
    const update = mock.method(SectorMerriageRecord, 'update', async () => [1]);

    const response = await updateSectorMerriage(5, { ...valid(), civilPlace: 'Chillán', sectorChurchId: 9 }, 3);

    assert.equal(response.code, 200);
    const saved = update.mock.calls[0].arguments[0] as any;
    assert.equal(saved.civilPlace, 'Chillán');
    assert.equal('sectorChurchId' in saved, false);
});
```

- [ ] **Step 2: Ejecutar los tests y verificar que fallan**

Run: `pnpm test`
Expected: FAIL con `Cannot find module './sectorMerriageRecord.service'`.

- [ ] **Step 3: Implementar el servicio**

Crear `src/services/sectorMerriageRecord.service.ts`:

```ts
import SectorMerriageRecord from '../db/models/sectorMerriageRecord.model';
import SectorChurch from '../db/models/sectorChurch.model';
import logger from '../utils/logger';

export interface ServiceResponse {
    code: number;
    message: string;
}

interface MerriageFields {
    husbandId: string;
    fullNameHusband: string;
    wifeId: string;
    fullNameWife: string;
    civilCode: number;
    civilDate: Date;
    civilPlace: string;
    religiousDate: Date;
}

const REQUIRED_FIELDS: (keyof MerriageFields)[] = [
    'husbandId', 'fullNameHusband', 'wifeId', 'fullNameWife',
    'civilCode', 'civilDate', 'civilPlace', 'religiousDate',
];

const NOT_FOUND: ServiceResponse = { code: 404, message: 'Registro no encontrado' };

const churchInclude = { model: SectorChurch, as: 'sectorChurch', attributes: ['name'] };

const scopedWhere = (scopeId: number | undefined) => ({
    deleted: false,
    ...(scopeId !== undefined ? { sectorChurchId: scopeId } : {}),
});

const toId = (id: unknown): number | null => {
    if (typeof id !== 'number' && typeof id !== 'string') return null;
    const n = Number(id);
    return Number.isInteger(n) && n > 0 ? n : null;
};

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

// 0 si no es un entero positivo, para que la validación de requeridos lo rechace.
const positiveInt = (value: unknown): number => {
    return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : 0;
};

// Copia solo los campos del matrimonio. Lo que no está aquí (id, deleted,
// sectorChurchId) nunca puede venir del cliente.
const pickFields = (data: any): MerriageFields => ({
    husbandId: text(data?.husbandId),
    fullNameHusband: text(data?.fullNameHusband),
    wifeId: text(data?.wifeId),
    fullNameWife: text(data?.fullNameWife),
    civilCode: positiveInt(data?.civilCode),
    civilDate: data?.civilDate,
    civilPlace: text(data?.civilPlace),
    religiousDate: data?.religiousDate,
});

const missingField = (fields: MerriageFields): string | undefined => {
    return REQUIRED_FIELDS.find((field) => !fields[field]);
};

const toDTO = (record: SectorMerriageRecord) => {
    const plain: any = record.get({ plain: true });
    return { ...plain, sectorChurchName: plain.sectorChurch?.name ?? null };
};

const getAllSectorMerriages = async (scopeId: number | undefined) => {
    const records = await SectorMerriageRecord.findAll({
        where: scopedWhere(scopeId),
        include: [churchInclude],
        order: [['id', 'DESC']],
    });
    return records.map(toDTO);
};

const getSectorMerriageById = async (id: unknown, scopeId: number | undefined) => {
    const recordId = toId(id);
    if (recordId === null) return null;

    const record = await SectorMerriageRecord.findOne({
        where: { id: recordId, ...scopedWhere(scopeId) },
        include: [churchInclude],
    });
    return record ? toDTO(record) : null;
};

const countSectorMerriages = async (scopeId: number | undefined): Promise<number> => {
    return await SectorMerriageRecord.count({ where: scopedWhere(scopeId) });
};

const createSectorMerriage = async (data: any, sectorChurchId: number): Promise<ServiceResponse> => {
    try {
        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        await SectorMerriageRecord.create({ ...fields, sectorChurchId });
        return { code: 201, message: 'Certificado de Matrimonio creado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorMerriageRecord - create', error);
        return { code: 500, message: 'Error interno del servidor al crear el registro de matrimonio' };
    }
};

const updateSectorMerriage = async (id: unknown, data: any, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const fields = pickFields(data);
        const missing = missingField(fields);
        if (missing) {
            return { code: 400, message: `Campo requerido faltante: ${missing}` };
        }

        const [updatedRows] = await SectorMerriageRecord.update(
            fields,
            { where: { id: recordId, ...scopedWhere(scopeId) } }
        );
        if (updatedRows === 0) return NOT_FOUND;

        return { code: 200, message: 'Registro de matrimonio actualizado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorMerriageRecord - update', error);
        return { code: 500, message: 'Error interno al actualizar el registro de matrimonio' };
    }
};

const deleteSectorMerriage = async (id: unknown, scopeId: number | undefined): Promise<ServiceResponse> => {
    try {
        const recordId = toId(id);
        if (recordId === null) return NOT_FOUND;

        const [updatedRows] = await SectorMerriageRecord.update(
            { deleted: true },
            { where: { id: recordId, ...scopedWhere(scopeId) } }
        );
        if (updatedRows === 0) return NOT_FOUND;

        return { code: 200, message: 'Registro de matrimonio eliminado exitosamente' };
    } catch (error: any) {
        logger.logError('SectorMerriageRecord - delete', error);
        return { code: 500, message: 'Error interno del servidor al eliminar el registro de matrimonio' };
    }
};

export {
    getAllSectorMerriages,
    getSectorMerriageById,
    countSectorMerriages,
    createSectorMerriage,
    updateSectorMerriage,
    deleteSectorMerriage,
};
```

- [ ] **Step 4: Ejecutar los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, 49 tests.

- [ ] **Step 5: Esquema y resolver**

Crear `src/graphql/typeDefs/sectorMerriageRecord.typeDef.ts`. Reutiliza `MerriageRecordInput`, que ya tiene exactamente los ocho campos:

```ts
import { gql } from 'graphql-tag';

const dataTypesSectorMerriageRecord = gql`
  type SectorMerriageRecordQuery {
    getAll(sectorChurchId: ID): [SectorMerriageRecord]
    getById(id: ID!): SectorMerriageRecord
    count: Int
  }

  type SectorMerriageRecordMutation {
    create(merriageRecord: MerriageRecordInput!): Response
    update(id: ID!, merriageRecord: MerriageRecordInput!): Response
    delete(id: ID!): Response
  }

  type SectorMerriageRecord {
    id: ID!
    sectorChurchId: ID!
    sectorChurchName: String
    husbandId: ID!
    fullNameHusband: String!
    wifeId: ID!
    fullNameWife: String!
    civilCode: Int!
    civilDate: Date!
    civilPlace: String!
    religiousDate: Date!
  }
`;

export default dataTypesSectorMerriageRecord;
```

Crear `src/graphql/resolvers/sectorMerriageRecord.resolver.ts`:

```ts
import * as sectorMerriageService from '../../services/sectorMerriageRecord.service';
import { isSectorPastor, sectorScope } from '../../utils/tokensLogs';
import { GraphQLContext, GraphQLArgs } from '../types';
import { runSector, arg } from './sector.util';

const SERVICE = 'SectorMerriageRecord';

const resolversSectorMerriageRecord = {
    SectorMerriageRecordQuery: {
        getAll: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - getAll', SERVICE, context, async () => {
                const scopeId = sectorScope(context.user, arg(parent, args, 'sectorChurchId'));
                return await sectorMerriageService.getAllSectorMerriages(scopeId);
            }),
        getById: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - getById', SERVICE, context, async () => {
                return await sectorMerriageService.getSectorMerriageById(arg(parent, args, 'id'), sectorScope(context.user));
            }),
        count: (_parent: any, _args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - count', SERVICE, context, async () => {
                return await sectorMerriageService.countSectorMerriages(sectorScope(context.user));
            }),
    },

    SectorMerriageRecordMutation: {
        create: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - create', SERVICE, context, async () => {
                // Un registro siempre nace desde la cuenta de la iglesia.
                if (!isSectorPastor(context.user)) throw new Error('No autorizado');
                const sectorChurchId = sectorScope(context.user) as number;
                return await sectorMerriageService.createSectorMerriage(arg(parent, args, 'merriageRecord'), sectorChurchId);
            }),
        update: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - update', SERVICE, context, async () => {
                return await sectorMerriageService.updateSectorMerriage(
                    arg(parent, args, 'id'),
                    arg(parent, args, 'merriageRecord'),
                    sectorScope(context.user)
                );
            }),
        delete: (parent: any, args: GraphQLArgs, context: GraphQLContext) =>
            runSector('SectorMerriageRecord - delete', SERVICE, context, async () => {
                return await sectorMerriageService.deleteSectorMerriage(arg(parent, args, 'id'), sectorScope(context.user));
            }),
    },
};

export default resolversSectorMerriageRecord;
```

- [ ] **Step 6: Registrar el namespace**

En `src/graphql/typeDefs.ts`:

Después de `import dataTypesSectorBaptismRecord from './typeDefs/sectorBaptismRecord.typeDef';`:

```ts
import dataTypesSectorMerriageRecord from './typeDefs/sectorMerriageRecord.typeDef';
```

Después de `${dataTypesSectorBaptismRecord}`:

```
    ${dataTypesSectorMerriageRecord}
```

Dentro de `type Query { ... }`, después de `SectorBaptismRecord: SectorBaptismRecordQuery`:

```
        SectorMerriageRecord: SectorMerriageRecordQuery
```

Dentro de `type Mutation { ... }`, después de `SectorBaptismRecord: SectorBaptismRecordMutation`:

```
        SectorMerriageRecord: SectorMerriageRecordMutation
```

En `src/graphql/resolvers.ts`:

Después de `import resolverSectorBaptismRecord from './resolvers/sectorBaptismRecord.resolver';`:

```ts
import resolverSectorMerriageRecord from './resolvers/sectorMerriageRecord.resolver';
```

Dentro de `Query: { ... }`, después del bloque `SectorBaptismRecord`:

```ts
        SectorMerriageRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverSectorMerriageRecord.SectorMerriageRecordQuery, context);
        },
```

Dentro de `Mutation: { ... }`, después del bloque `SectorBaptismRecord`:

```ts
        SectorMerriageRecord: (_: any, __: any, context: any) => {
            return bindContextToResolvers(resolverSectorMerriageRecord.SectorMerriageRecordMutation, context);
        },
```

- [ ] **Step 7: Verificar contra el servidor real**

Run: `pnpm build`
Expected: compila sin errores.

Con `pnpm dev` corriendo y `PASTOR`, `OTRO`, `ADMIN` y `gql` definidos como en las Tasks 5 y 6:

```bash
gql "$PASTOR" '{"query":"mutation($merriageRecord: MerriageRecordInput!){ SectorMerriageRecord { create(merriageRecord:$merriageRecord){ code message } } }","variables":{"merriageRecord":{"husbandId":"15.111.222-3","fullNameHusband":"Pedro Soto","wifeId":"16.111.222-3","fullNameWife":"Marta Díaz","civilCode":45,"civilDate":"2026-08-01","civilPlace":"Bulnes","religiousDate":"2026-08-15"}}}'
```

Expected: `"code":201`.

```bash
Q='{"query":"{ SectorMerriageRecord { getAll { id sectorChurchName fullNameHusband civilDate religiousDate } count } }"}'
gql "$PASTOR" "$Q"
gql "$OTRO" "$Q"
gql "$ADMIN" "$Q"
```

Expected: Bulnes ve un registro con `"civilDate":"2026-08-01"`; Coihueco ve lista vacía y `count 0`; el administrador lo ve con `"sectorChurchName":"Bulnes"`.

Editar como administrador y verificar que Coihueco no puede (reemplaza `1` por el `id` real):

```bash
gql "$OTRO" '{"query":"mutation($id: ID!, $merriageRecord: MerriageRecordInput!){ SectorMerriageRecord { update(id:$id, merriageRecord:$merriageRecord){ code message } } }","variables":{"id":"1","merriageRecord":{"husbandId":"15.111.222-3","fullNameHusband":"X","wifeId":"16.111.222-3","fullNameWife":"Y","civilCode":45,"civilDate":"2026-08-01","civilPlace":"Z","religiousDate":"2026-08-15"}}}'
gql "$ADMIN" '{"query":"mutation($id: ID!, $merriageRecord: MerriageRecordInput!){ SectorMerriageRecord { update(id:$id, merriageRecord:$merriageRecord){ code message } } }","variables":{"id":"1","merriageRecord":{"husbandId":"15.111.222-3","fullNameHusband":"Pedro Soto","wifeId":"16.111.222-3","fullNameWife":"Marta Díaz","civilCode":45,"civilDate":"2026-08-01","civilPlace":"Chillán","religiousDate":"2026-08-15"}}}'
gql "$PASTOR" "$Q"
```

Expected: `404 Registro no encontrado`; `200`; y el listado de Bulnes muestra `fullNameHusband` sin cambios (`Pedro Soto`).

- [ ] **Step 8: Commit**

```bash
git add src/services/sectorMerriageRecord.service.ts src/services/sectorMerriageRecord.service.test.ts \
        src/graphql/typeDefs/sectorMerriageRecord.typeDef.ts src/graphql/resolvers/sectorMerriageRecord.resolver.ts \
        src/graphql/typeDefs.ts src/graphql/resolvers.ts
git commit -m "feat: matrimonios del sector con alcance por iglesia"
```

---

### Task 8: Verificación final

**Files:** ninguno nuevo.

- [ ] **Step 1: Suite completa y compilación**

Run: `pnpm test`
Expected: PASS, 49 tests, 0 fallos.

Run: `pnpm build`
Expected: compila sin errores y `dist/` no contiene archivos `*.test.js`:

```bash
find dist -name '*.test.js' | wc -l
```

Expected: `0`.

- [ ] **Step 2: Todos los resolvers siguen pasando por la autorización**

```bash
for f in src/graphql/resolvers/*.resolver.ts; do
  resolvers=$(grep -cE '^[[:space:]]+[a-zA-Z]+: (async )?\(' "$f")
  guards=$(grep -cE 'validateContext\(|runSector\(' "$f")
  echo "$f resolvers=$resolvers guards=$guards"
done
```

Expected: en cada archivo `resolvers` es igual a `guards`. Si algún archivo tiene menos guardas que resolvers, hay un resolver sin proteger: detente y repórtalo.

- [ ] **Step 3: Las tablas de Zañartu no cambiaron**

```bash
git diff main --stat -- src/db/models/baptismRecord.model.ts src/db/models/merriageRecord.model.ts \
  src/db/models/church.model.ts src/services/baptismRecord.service.ts src/services/merriageRecord.service.ts \
  src/graphql/resolvers/baptismRecord.resolver.ts src/graphql/resolvers/merriageRecord.resolver.ts
```

Expected: salida vacía.

- [ ] **Step 4: Un usuario de Zañartu sigue funcionando igual**

Con `pnpm dev` corriendo y `ADMIN` y `gql` definidos:

```bash
gql "$ADMIN" '{"query":"{ BaptismRecord { getAll { childRUT } } MerriageRecord { count } Church { getAll { id name } } }"}'
```

Expected: datos sin errores (las listas pueden venir vacías en una base local nueva).

- [ ] **Step 5: Ninguna clave en el repositorio ni en los logs**

```bash
git log main..HEAD -p > /tmp/sector-backend.diff
grep -oE '[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$' /Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt \
  | while read -r clave; do grep -c -- "$clave" /tmp/sector-backend.diff; done | sort -u
rm /tmp/sector-backend.diff
git status --short
```

Expected: el bucle imprime una sola línea, `0` (ninguna clave real aparece en los commits de la rama); `git status` no muestra archivos sin versionar.

Revisa además la salida acumulada de `pnpm dev`: no debe contener ninguna clave ni líneas `password:`.

- [ ] **Step 6: Notas de despliegue**

No hay nada que commitear en este paso. Deja estas notas en el mensaje final al usuario:

1. En producción hay que ejecutar `pnpm db:migrate` y luego `pnpm db:seed:sector`, en ese orden.
2. El archivo `/Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt` tiene las claves iniciales. Hay que entregarlas a cada pastor y después borrar el archivo.
3. Si delante del backend hay un proxy con rutas explícitas, hay que permitir `GET /auth/sector-churches` y `POST /auth/sector-login`.
4. El frontend agrega el nombre de la operación a la URL (`/graphql/<operationName>`); si el proxy filtra por nombre de operación, hay que permitir las nuevas, que se listan en el plan del frontend.
