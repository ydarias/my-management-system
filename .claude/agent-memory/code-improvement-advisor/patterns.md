# Patterns & Anti-Patterns — my-management-system

## Recurring Anti-Patterns

### 1. Hardcoded secrets
Both `auth.module.ts` (line 13) and `jwt.strategy.ts` (line 15) hardcode `'super-secret-key'`.
Fix: use `ConfigService.getOrThrow('JWT_SECRET')` with `JwtModule.registerAsync`.

### 2. Optional domain fields from infrastructure constraints
`User.id` and `User.updatedAt` are optional because they are assigned by the DB,
but this propagates `?` through mappers into the shared `UserResponse` contract.
Fix: split into `NewUser` (pre-save) and `User extends NewUser { id: number; updatedAt: Date }`.

### 3. Split token lifecycle across components
- `App.tsx` initializes token state from localStorage (line 10)
- `LoginForm.tsx` writes `localStorage.setItem('token', ...)` (line 30)
- `HelloPage.tsx` calls `localStorage.removeItem('token')` (line 7)
Fix: `App.tsx` should own all localStorage reads/writes; pass `onLogin` and `onLogout` callbacks that handle storage internally.

### 4. `UserEntity implements User` — layer coupling
Infrastructure entity implementing a domain interface violates hexagonal arch (infrastructure depends on domain is fine, but `implements` means the interface is now constrained by the entity's shape).
Fix: remove `implements User`; TypeScript structural typing provides compatibility automatically.

### 5. `Map<Function, ...>` for error class mapping
`error-mappings.ts` uses `Map<Function, HttpStatus>` — `Function` is too broad.
Fix: use `Map<new (...args: unknown[]) => Error, HttpStatus>`.

### 6. Dead `success` state in `CreateUserForm`
`success` state is set at line 34, then `onSuccess?.()` at line 38 triggers navigation away, unmounting the component. The `{success && ...}` block at line 93 can never be seen by the user in the register flow.
Fix: remove `success` state; rely on `onSuccess` callback entirely.

### 7. Absolute hardcoded `API_BASE_URL` in UI client
`http://localhost:3001/` in `apps/ui/src/api/client.ts` bypasses the Vite proxy.
The Vite proxy at `/api` strips the prefix before forwarding — but the API has NO `/api` global prefix.
Fix: change `API_BASE_URL` to `'/api/'` AND add `app.setGlobalPrefix('api')` in `main.ts`, OR remove the proxy and keep the absolute URL only for local dev (via env var).

### 8. `@Inject(JwtService)` is redundant
`AuthController` uses `@Inject(JwtService)` but class-based tokens don't need `@Inject`; NestJS resolves them automatically.
Fix: use standard constructor injection: `constructor(private readonly jwtService: JwtService)`.

### 9. `access_token` vs `accessToken` mismatch
`LoginForm.tsx` line 22 expects `{ access_token: string }` but `LoginResponse` from `@repo/shared` defines `accessToken`.
This is a silent bug: `data.access_token` is always `undefined`; the token is never stored.
Fix: type the response as `LoginResponse` and use `data.accessToken`.

### 10. `@Global()` on `AppModule` is unnecessary
The providers `'UserRepository'` and `'PasswordHasher'` are only consumed by `UsersModule` and `AuthModule`, both of which are already imported in `AppModule`. `@Global()` makes them available to every future module without explicit import.
Fix: remove `@Global()` and add `exports` + re-imports where needed, or use `@Global()` intentionally only for truly cross-cutting concerns.

## DB Config Duplication
`app.module.ts` and `data-source.ts` both define DB connection config independently.
Fix: extract to a shared factory function or configuration object.

## DI Token Naming Convention
String tokens `'UserRepository'` and `'PasswordHasher'` work but typos are not caught at compile time.
Consider `Symbol('UserRepository')` or an `InjectionToken` constant for stricter safety.

## Test Scoping Convention
- CORRECT pattern (`create-user.use-case.test.ts`): mocks + `useCase` + `beforeEach` all INSIDE `describe`
- BUG pattern (`validate-credentials.use-case.test.ts`): mocks at module scope, `describe` wraps only test cases
- Always place mocks inside the `describe` block they serve.

## `CreateUserRequest` Type Inconsistency
`CreateUserRequest` in `packages/shared` is a `class` (line 1), while all other shared types (`UserLoginRequest`, `LoginResponse`, `UserResponse`) are `interface`. This is inconsistent and forces a class import in the UI, which is unusual for a pure data contract.
Fix: convert to `interface CreateUserRequest`.

## Migration `updated_at` Default
The `updated_at` column in `CreateUsersTable1739750400000` uses `default: 'now()'`.
This sets a creation-time default but does NOT auto-update on subsequent writes.
TypeORM's `@UpdateDateColumn` handles the update path at the ORM level, but direct SQL updates would not trigger it.
Consider `ON UPDATE CURRENT_TIMESTAMP` or rely solely on TypeORM for updates.
