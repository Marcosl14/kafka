# Consumer (TypeScript)

Pequeña app Node + Express que consume del topic `mensajes` y muestra mensajes en consola.

Comandos locales (desde `consumer`):

- Instalar dependencias:

```bash
npm install
```

- Compilar TypeScript:

```bash
npm run build
```

- Ejecutar compilado:

```bash
npm start
```

- Ejecutar en modo desarrollo (ts-node):

```bash
npm run dev
```

Usando Docker Compose (desde la raíz del repo):

```bash
# Reconstruir imagen del consumer
docker compose build consumer
# Levantar kafka y consumer
docker compose up -d kafka consumer
# Seguir logs del consumer
docker compose logs -f consumer
```

Variables de entorno útiles:

- `KAFKA_BROKER` (por defecto `kafka:29092`)
- `KAFKA_TOPIC` (por defecto `mensajes`)
- `KAFKA_GROUP_ID` (por defecto `consumer-simple-group`)
- `KAFKA_ISOLATION_LEVEL` (0 = read_uncommitted, 1 = read_committed; por defecto 1)
