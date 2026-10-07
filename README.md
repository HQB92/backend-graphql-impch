# backend-graphql-impch

Backend GraphQL para IMPCH Zañartu

## Requisitos

- Node.js
- pnpm
- Docker y Docker Compose

## Configuración

1. Copia el archivo `env.example` a `.env`:
```bash
cp env.example .env
```

2. Edita el archivo `.env` con tus configuraciones si es necesario (por defecto funciona con Docker).

## Base de Datos con Docker

### Levantar la base de datos

```bash
# Opción 1: Usando npm/pnpm script
pnpm db:up

# Opción 2: Usando docker-compose directamente
docker-compose up -d postgres
```

### Ver logs de la base de datos

```bash
pnpm db:logs
```

### Detener la base de datos

```bash
pnpm db:down
```

### Reiniciar la base de datos (elimina todos los datos)

```bash
pnpm db:reset
```

## Migraciones y Seeders

Una vez que la base de datos esté corriendo:

```bash
# Ejecutar migraciones
npx sequelize-cli db:migrate

# Ejecutar seeders
npx sequelize-cli db:seed:all
```

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor en modo desarrollo
pnpm dev

# Iniciar servidor en producción
pnpm start
```

El servidor estará disponible en `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

## Despliegue: acceso de pastores del sector

1. Ejecutar `pnpm db:migrate:status` contra producción y confirmar que SOLO están pendientes las tres migraciones `20261007…`. Si también aparecen pendientes migraciones anteriores, detenerse: las tablas de producción no se crearon a partir de estas migraciones.
2. Ejecutar `pnpm db:migrate`.
3. Ejecutar `pnpm db:seed:sector`. Nunca `db:seed:all`, porque también correría los seeders antiguos de usuarios, miembros e iglesias.
4. Desplegar el código.
5. Si hay un proxy delante del backend que lista las rutas de forma explícita, permitir `GET /auth/sector-churches` y `POST /auth/sector-login`.
6. Las claves iniciales están en un archivo fuera de los repositorios, generado con `node scripts/generate-sector-seed.js`: entregar cada una a su pastor y borrar el archivo.

- Las mutaciones de gestión de usuarios (crear, actualizar, eliminar, resetear clave) ahora exigen el rol Administrador; el cambio de clave lo puede hacer un Administrador o el propio usuario sobre su cuenta.
- Los inicios de sesión (`/auth/login` y `/auth/sector-login`) se limitan a 10 intentos fallidos cada 15 minutos por cuenta e IP. El contador vive en memoria: se reinicia al reiniciar el servidor y es por instancia.
