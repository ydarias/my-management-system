# Turborepo + TypeScript Monorepo

Proyecto monorepo configurado con Turborepo, TypeScript y una arquitectura modular que separa los casos de uso de la UI y la API.

## 📁 Estructura del Proyecto

```
turborepo-project/
├── apps/
│   ├── api/              # API REST con Express
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── repositories/
│   │   │   └── index.ts
│   │   └── tests/
│   └── ui/               # Aplicación React con Vite
│       ├── src/
│       │   └── components/
│       └── tests/
├── packages/
│   ├── shared/           # Tipos y utilidades compartidas
│   │   ├── src/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── tests/
│   ├── use-cases/        # Lógica de negocio (casos de uso)
│   │   ├── src/
│   │   └── tests/
│   └── test-config/      # Configuración compartida de Jest
│       └── jest.config.js
├── turbo.json            # Configuración de Turborepo
├── tsconfig.base.json    # TypeScript config base
└── package.json          # Root package.json
```

## 🏗️ Arquitectura

### Separación de Responsabilidades

- **`@repo/shared`**: Tipos TypeScript, interfaces y utilidades compartidas por todo el monorepo
- **`@repo/use-cases`**: Lógica de negocio pura, independiente de infraestructura
- **`@repo/api`**: Capa de API REST que consume los casos de uso
- **`@repo/ui`**: Interfaz de usuario React que consume la API
- **`@repo/test-config`**: Configuración compartida del test harness (Jest)

### Ventajas de esta Arquitectura

1. **Reutilización**: Los casos de uso pueden ser consumidos tanto por la API como directamente por la UI
2. **Testabilidad**: Cada capa tiene sus propios tests con configuración compartida
3. **Mantenibilidad**: Cambios en la lógica de negocio no afectan directamente a la UI o API
4. **Escalabilidad**: Fácil añadir nuevas apps o packages al monorepo

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Instalar dependencias de todos los workspaces
npm install --workspaces
```

## 📦 Comandos Disponibles

### Desarrollo

```bash
# Iniciar todos los proyectos en modo desarrollo
npm run dev

# Iniciar solo la API
npm run dev --workspace=@repo/api

# Iniciar solo la UI
npm run dev --workspace=@repo/ui
```

### Build

```bash
# Build de todos los proyectos
npm run build

# Build de un proyecto específico
npm run build --workspace=@repo/use-cases
```

### Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con coverage
npm run test --workspace=@repo/use-cases -- --coverage

# Tests en modo watch
npm run test --workspace=@repo/api -- --watch
```

### Otros

```bash
# Linting
npm run lint

# Formateo con Prettier
npm run format

# Limpiar archivos generados
npm run clean
```

## 🧪 Test Harness Compartido

Todos los paquetes utilizan la misma configuración base de Jest ubicada en `@repo/test-config`:

```javascript
// En cada jest.config.js
const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'nombre-del-paquete',
  // Configuración específica del paquete
};
```

### Características del Test Harness

- **ts-jest** para soporte de TypeScript
- **Path aliases** con `@/` para imports relativos
- **Coverage** configurado por defecto
- **Timeout** de 10 segundos por test
- Soporte para `.spec.ts` y `.test.ts`

## 🔄 Flujo de Desarrollo

### Añadir un Nuevo Caso de Uso

1. Crear el caso de uso en `packages/use-cases/src/`
2. Escribir tests en `packages/use-cases/tests/`
3. Exportar desde `packages/use-cases/src/index.ts`
4. Consumir desde la API o UI

Ejemplo:

```typescript
// packages/use-cases/src/my-use-case.ts
export class MyUseCase {
  async execute(input: MyInput): Promise<MyOutput> {
    // Lógica de negocio
  }
}

// apps/api/src/routes/my.routes.ts
import { MyUseCase } from '@repo/use-cases';

const useCase = new MyUseCase(dependencies);
const result = await useCase.execute(input);
```

### Añadir una Nueva App

```bash
mkdir -p apps/nueva-app
cd apps/nueva-app
npm init -y
```

Luego añadir las dependencias necesarias y configurar TypeScript.

## 🌐 Endpoints de la API

La API corre por defecto en `http://localhost:3001`:

- `GET /health` - Health check
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID

## 🎨 UI

La UI corre por defecto en `http://localhost:3000` y se conecta automáticamente a la API mediante proxy configurado en Vite.

## 📝 Notas Importantes

- **TypeScript References**: Los packages usan project references de TypeScript para builds incrementales
- **Workspaces**: npm workspaces maneja las dependencias internas automáticamente
- **Turbo Cache**: Turborepo cachea los resultados de builds y tests para mayor velocidad
- **Test Isolation**: Cada package tiene sus propios tests pero comparte configuración

## 🔧 Configuración de TypeScript

El proyecto usa una configuración base compartida (`tsconfig.base.json`) que es extendida por cada package/app según sus necesidades específicas.

## 🎯 Próximos Pasos

1. Configurar ESLint para linting de código
2. Añadir más casos de uso según las necesidades del negocio
3. Implementar autenticación y autorización
4. Añadir base de datos real (PostgreSQL, MongoDB, etc.)
5. Configurar CI/CD con GitHub Actions o similar
6. Añadir Storybook para documentación de componentes UI

## 📚 Recursos

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Jest Documentation](https://jestjs.io/)
