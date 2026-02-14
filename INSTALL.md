# Instrucciones de Instalación

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 10.2.4

## Pasos para Ejecutar el Proyecto

### 1. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install
```

Este comando instalará todas las dependencias en todos los workspaces del monorepo.

### 2. Compilar los Packages

```bash
# Compilar todos los packages
npm run build
```

Esto compilará:
- `@repo/shared`
- `@repo/use-cases`
- `@repo/test-config`

### 3. Iniciar la API

```bash
# En una terminal
cd apps/api
cp .env.example .env
npm run dev
```

La API estará disponible en `http://localhost:3001`

### 4. Iniciar la UI

```bash
# En otra terminal
cd apps/ui
npm run dev
```

La UI estará disponible en `http://localhost:3000`

### 5. Ejecutar Tests

```bash
# Desde la raíz del proyecto
npm run test
```

O para un package específico:

```bash
npm run test --workspace=@repo/use-cases
```

## Comandos Útiles

```bash
# Ejecutar todos los proyectos en modo desarrollo (desde la raíz)
npm run dev

# Build de todo el proyecto
npm run build

# Ejecutar tests con coverage
npm run test -- --coverage

# Formatear código
npm run format

# Limpiar archivos generados
npm run clean
```

## Verificación de la Instalación

1. Verifica que la API responde:
   ```bash
   curl http://localhost:3001/health
   ```
   
   Deberías ver:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

2. Abre el navegador en `http://localhost:3000` y deberías ver el formulario de creación de usuarios.

3. Crea un usuario de prueba y verifica que funciona correctamente.

## Solución de Problemas

### Error: Cannot find module '@repo/...'

Asegúrate de haber ejecutado `npm run build` primero para compilar los packages compartidos.

### Error: EADDRINUSE :::3001 o :::3000

El puerto ya está en uso. Mata el proceso o cambia el puerto en `.env` (API) o `vite.config.ts` (UI).

### Tests fallan con errores de módulos

Ejecuta `npm install` en la raíz del proyecto para asegurar que todas las dependencias estén instaladas.

## Estructura de Workspaces

El proyecto usa npm workspaces. Las dependencias internas se resuelven automáticamente:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Esto permite que `@repo/api` y `@repo/ui` puedan importar desde `@repo/use-cases` y `@repo/shared` sin necesidad de publicar los packages a npm.
