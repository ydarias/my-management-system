# Code Improvement Advisor — Project Memory

## Key Architectural Facts
- Turborepo monorepo: `apps/api` (NestJS), `apps/ui` (React+Vite), `packages/shared` (contracts), `packages/test-config`
- Hexagonal arch: domain in `apps/api/src/domain/`, adapters in `apps/api/src/database/` and `apps/api/src/auth/`
- Shared types are in `packages/shared/src/types/` and re-exported from `packages/shared/src/index.ts`
- DI tokens: `'UserRepository'` and `'PasswordHasher'` (string tokens) in `AppModule`, consumed in `UsersModule` and `AuthModule`
- Vite proxy: `/api` prefix routes to `http://localhost:3001`, but the API routes are NOT prefixed with `/api` — mismatch
- See `patterns.md` for detailed recurring patterns

## Confirmed Issues (Full Review — 2026-02-26)
- JWT secret hardcoded as `'super-secret-key'` in `auth.module.ts` (line 13) and `jwt.strategy.ts` (line 15) — HIGH security
- `LoginForm.tsx` uses `{ access_token: string }` (snake_case) but `LoginResponse` is `{ accessToken }` (camelCase) — silent undefined token bug
- `App.tsx` `handleLogin` does NOT write to localStorage; `LoginForm` does — split token lifecycle across components
- `HelloPage` removes from localStorage directly — token lifecycle split across 3 files
- `UserEntity implements User` couples infrastructure to domain interface — hexagonal violation
- `User.id?: number` and `User.updatedAt?: Date` with TODO — optional fields propagate into `UserResponse` shared contract
- `CreateUserForm` has a `success` state that is set then immediately cleared by `onSuccess?.()` navigating away — dead state
- `DOMAIN_ERROR_MAPPINGS` uses `Map<Function, HttpStatus>` — use `new (...args: unknown[]) => Error` instead
- `GlobalExceptionFilter` returns empty `{}` body for domain errors — clients get no error message
- `AppModule` is `@Global()` unnecessarily — providers are only consumed by modules already imported there
- `apiClient` base URL is `'http://localhost:3001/'` bypassing Vite proxy (which strips `/api` prefix) — hardcoded absolute URL
- `create-user.use-case.test.ts`: mocks declared inside `describe` but `useCase` is also inside — correct pattern
- `validate-credentials.use-case.test.ts`: mocks + `useCase` + `beforeEach` declared at module scope outside `describe` — inconsistent
- `AuthController` uses `@Inject(JwtService)` but `JwtService` is a class token and doesn't require `@Inject` — redundant decorator
- CORS origin hardcoded to `'http://localhost:3000'` in `main.ts`
- DB config and port hardcoded in `app.module.ts` and `main.ts` — should all use `ConfigService`
- `data-source.ts` duplicates DB config already in `app.module.ts`
- `updated_at` migration column uses `default: 'now()'` — does not auto-update on row changes; TypeORM `@UpdateDateColumn` handles this but the migration default is wrong
- `InMemoryUserRepository.save` always inserts (increments `currentId`) — no update path exists; `UserRepository.save` implies upsert semantics

## Style Conventions Observed
- Mappers are static-method classes (`UserMapper`, `AuthMapper`) — consistent; single-method mappers could be plain functions
- Use cases are plain classes with constructor injection (no NestJS decorators) — correct hexagonal pattern
- Error classes set `this.name` explicitly in constructor — consistent
- Test files use `jest-mock-extended` `mock<T>()` + `mockReset` in `beforeEach`
- Snapshot testing used for use case return values with `expect.any(Date)` matchers
- `CreateUserRequest` is a `class` in shared — inconsistent with other shared types which are `interface`

## Reference Files (High Quality)
- `apps/api/src/domain/create-user.use-case.ts` — clean use case
- `apps/api/src/domain/create-user.use-case.test.ts` — correct test scoping
- `apps/api/src/auth/local.strategy.ts` — minimal and clean adapter

## Link to Detail
- See `patterns.md` for extended notes
