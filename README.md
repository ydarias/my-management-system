# My Management System

A Turborepo monorepo built with NestJS, React, and TypeScript, following hexagonal architecture (ports & adapters).

## Project Structure

```
my-management-system/
├── apps/
│   ├── api/              # NestJS REST API (port 3001)
│   └── ui/               # React + Vite frontend (port 3000)
├── packages/
│   ├── shared/           # Shared request/response types (API contract)
│   └── test-config/      # Shared Jest base configuration
├── docker-compose.yml    # PostgreSQL 17
├── turbo.json
├── tsconfig.base.json
└── package.json
```

## Architecture

The API follows **hexagonal architecture** (ports & adapters):

- **Domain layer** (`apps/api/src/domain/`) — use cases, domain models, port interfaces. No external dependencies.
- **Adapters** (`apps/api/src/database/`, `apps/api/src/auth/`) — concrete implementations of ports (TypeORM, Bcrypt).
- **Controllers** (`apps/api/src/users/`, `apps/api/src/auth/`) — HTTP entry points. Receive shared request types, return shared response types.
- **`@repo/shared`** — TypeScript types shared between API and UI as a contract. The UI must not import from the domain layer.

### Dependency flow

```
apps/api  ──► @repo/shared
apps/ui   ──► @repo/shared
```

## Prerequisites

- Node.js 24 (see `.nvmrc`)
- npm >= 10.2.4
- Docker (for PostgreSQL)

## Setup

```bash
# Use the correct Node version
nvm use

# Install all dependencies
npm install

# Start PostgreSQL
docker-compose up -d

# Build shared packages (required before first run)
npm run build

# Run database migrations
npm run migration:run --workspace=@repo/api
```

## Running in Development

```bash
# Run all apps and packages in watch mode
npm run dev

# Run only the API
npm run dev --workspace=@repo/api

# Run only the UI
npm run dev --workspace=@repo/ui
```

## Commands

### Root

```bash
npm run build      # Build all packages via Turbo
npm run dev        # Start all packages in watch mode
npm run test       # Run all tests
npm run lint       # Type-check all packages (tsc --noEmit)
npm run format     # Format with Prettier
npm run clean      # Remove dist/ and node_modules/
```

### Per workspace

```bash
npm run test --workspace=@repo/api
npm run test --workspace=@repo/ui
npm run build --workspace=@repo/shared
```

### Database migrations (API)

```bash
npm run migration:run --workspace=@repo/api       # Apply pending migrations
npm run migration:revert --workspace=@repo/api    # Revert last migration
npm run migration:generate --workspace=@repo/api  # Generate a new migration
```

## API Endpoints

Base URL: `http://localhost:3001`

| Method | Path          | Auth     | Description     |
|--------|---------------|----------|-----------------|
| POST   | `/users`      | None     | Register a user |
| POST   | `/auth/login` | None     | Log in          |

### POST /users

Request body (`CreateUserRequest`):
```json
{ "email": "user@example.com", "name": "Jane Doe", "password": "secret" }
```

Response (`UserResponse`):
```json
{ "id": 1, "email": "user@example.com", "name": "Jane Doe", "createdAt": "...", "updatedAt": "..." }
```

### POST /auth/login

Request body (`UserLoginRequest`):
```json
{ "email": "user@example.com", "password": "secret" }
```

Response (`LoginResponse`):
```json
{ "accessToken": "<jwt>" }
```

Subsequent requests to protected endpoints must include the header:
```
Authorization: Bearer <accessToken>
```

## Shared Types (`@repo/shared`)

| Type                | Kind        | Used as             |
|---------------------|-------------|---------------------|
| `CreateUserRequest` | class       | POST /users body    |
| `UserLoginRequest`  | interface   | POST /auth/login body |
| `UserResponse`      | interface   | POST /users response |
| `LoginResponse`     | interface   | POST /auth/login response |

## Environment Variables

Create a `.env` file inside `apps/api/` (defaults shown):

```bash
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=my_management_system
```

The Docker Compose file starts PostgreSQL with user `user`, password `password`, and database `my_management_system`. Override with the variables above if needed.

## Testing

```bash
# All tests
npm run test

# Watch mode for a workspace
npm run test:watch --workspace=@repo/api

# Coverage for a workspace
npm run test:coverage --workspace=@repo/api

# Single file
npx jest --config apps/api/jest.config.js path/to/file.test.ts
```

Test file conventions:
- Unit tests: `file-name.test.ts` — placed next to the file under test
- Integration tests: `file-name.spec.ts`

All packages share the base Jest configuration from `@repo/test-config` (ts-jest, path aliases, 10 s timeout).

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| API         | NestJS, Passport (Local + JWT), TypeORM, bcrypt |
| Database    | PostgreSQL 17 (via Docker)                      |
| UI          | React 19, React Router 7, Vite 7                |
| Shared      | TypeScript                                      |
| Build       | Turborepo, tsc                                  |
| Testing     | Jest, ts-jest, jest-mock-extended, Testcontainers |
| Formatting  | Prettier                                        |
