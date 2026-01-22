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
