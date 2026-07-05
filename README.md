# libreria-et

Aplicación de librería con frontend estático, backend en Node.js y base de datos MySQL.

## Ejecutar con Docker Compose

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

Esto levantará los siguientes servicios:

- Frontend: http://localhost:8080
- Backend: http://localhost:3001/api/health
- MySQL: localhost:3306

## Detener los contenedores

```bash
docker compose down
```

Para eliminar también los volúmenes de datos:

```bash
docker compose down -v
```