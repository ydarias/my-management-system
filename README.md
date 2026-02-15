# Turborepo + TypeScript Monorepo

Monorepo project configured with Turborepo, TypeScript, and a modular architecture that separates use cases from the UI and API.

## 📁 Project Structure

```
turborepo-project/
├── apps/
│   ├── api/              # REST API with Express
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── repositories/
│   │   │   └── index.ts
│   │   └── tests/
│   └── ui/               # React Application with Vite
│       ├── src/
│       │   └── components/
│       └── tests/
├── packages/
│   ├── shared/           # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── tests/
│   ├── use-cases/        # Business logic (use cases)
│   │   ├── src/
│   │   └── tests/
│   └── test-config/      # Shared Jest configuration
│       └── jest.config.js
├── turbo.json            # Turborepo configuration
├── tsconfig.base.json    # Base TypeScript config
└── package.json          # Root package.json
```

## 🏗️ Architecture

### Separation of Concerns

- **`@repo/shared`**: TypeScript types, interfaces, and utilities shared across the monorepo
- **`@repo/use-cases`**: Pure business logic, independent of infrastructure
- **`@repo/api`**: REST API layer that consumes the use cases
- **`@repo/ui`**: React user interface that consumes the API
- **`@repo/test-config`**: Shared test harness configuration (Jest)

### Advantages of This Architecture

1. **Reusability**: Use cases can be consumed by both the API and directly by the UI
2. **Testability**: Each layer has its own tests with shared configuration
3. **Maintainability**: Changes to business logic do not directly affect the UI or API
4. **Scalability**: Easy to add new apps or packages to the monorepo

## 🚀 Installation

```bash
# Install dependencies
npm install

# Install dependencies for all workspaces
npm install --workspaces
```

## 📦 Available Commands

### Development

```bash
# Start all projects in development mode
npm run dev

# Start only the API
npm run dev --workspace=@repo/api

# Start only the UI
npm run dev --workspace=@repo/ui
```

### Build

```bash
# Build all projects
npm run build

# Build a specific project
npm run build --workspace=@repo/use-cases
```

### Testing

```bash
# Run all tests
npm run test

# Tests with coverage
npm run test --workspace=@repo/use-cases -- --coverage

# Tests in watch mode
npm run test --workspace=@repo/api -- --watch
```

### Other

```bash
# Linting
npm run lint

# Formatting with Prettier
npm run format

# Clean generated files
npm run clean
```

## 🧪 Shared Test Harness

All packages use the same base Jest configuration located in `@repo/test-config`:

```javascript
// In each jest.config.js
const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'package-name',
  // Package-specific configuration
};
```

### Test Harness Features

- **ts-jest** for TypeScript support
- **Path aliases** with `@/` for relative imports
- **Coverage** configured by default
- **Timeout** of 10 seconds per test
- Support for `.spec.ts` and `.test.ts`

## 🔄 Development Workflow

### Adding a New Use Case

1. Create the use case in `packages/use-cases/src/`
2. Write tests in `packages/use-cases/tests/`
3. Export from `packages/use-cases/src/index.ts`
4. Consume from the API or UI

Example:

```typescript
// packages/use-cases/src/my-use-case.ts
export class MyUseCase {
  async execute(input: MyInput): Promise<MyOutput> {
    // Business logic
  }
}

// apps/api/src/routes/my.routes.ts
import { MyUseCase } from '@repo/use-cases';

const useCase = new MyUseCase(dependencies);
const result = await useCase.execute(input);
```

### Adding a New App

```bash
mkdir -p apps/new-app
cd apps/new-app
npm init -y
```

Then add the necessary dependencies and configure TypeScript.

## 🌐 API Endpoints

The API runs by default on `http://localhost:3001`:

- `GET /health` - Health check
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user by ID

## 🎨 UI

The UI runs by default on `http://localhost:3000` and automatically connects to the API via the proxy configured in Vite.

## 📝 Important Notes

- **TypeScript References**: Packages use TypeScript project references for incremental builds
- **Workspaces**: npm workspaces handles internal dependencies automatically
- **Turbo Cache**: Turborepo caches build and test results for improved speed
- **Test Isolation**: Each package has its own tests but shares configuration

## 🔧 TypeScript Configuration

The project uses a shared base configuration (`tsconfig.base.json`) that is extended by each package/app according to its specific needs.

## 🎯 Next Steps

1. Configure ESLint for code linting
2. Add more use cases based on business needs
3. Implement authentication and authorization
4. Add a real database (PostgreSQL, MongoDB, etc.)
5. Set up CI/CD with GitHub Actions or similar
6. Add Storybook for UI component documentation

## 📚 Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Jest Documentation](https://jestjs.io/)
