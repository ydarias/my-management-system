# Installation Instructions

## Prerequisites

- Node.js >= 18.0.0
- npm >= 10.2.4

## Steps to Run the Project

### 1. Install Dependencies

```bash
# From the project root
npm install
```

This command will install all dependencies across all monorepo workspaces.

### 2. Build the Packages

```bash
# Build all packages
npm run build
```

This will build:
- `@repo/shared`
- `@repo/use-cases`
- `@repo/test-config`

### 3. Start the API

```bash
# In a terminal
cd apps/api
cp .env.example .env
npm run dev
```

The API will be available at `http://localhost:3001`

### 4. Start the UI

```bash
# In another terminal
cd apps/ui
npm run dev
```

The UI will be available at `http://localhost:3000`

### 5. Run Tests

```bash
# From the project root
npm run test
```

Or for a specific package:

```bash
npm run test --workspace=@repo/use-cases
```

## Useful Commands

```bash
# Run all projects in development mode (from the root)
npm run dev

# Build the entire project
npm run build

# Run tests with coverage
npm run test -- --coverage

# Format code
npm run format

# Clean generated files
npm run clean
```

## Verifying the Installation

1. Verify the API is responding:
   ```bash
   curl http://localhost:3001/health
   ```

   You should see:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

2. Open your browser at `http://localhost:3000` and you should see the user creation form.

3. Create a test user and verify it works correctly.

## Troubleshooting

### Error: Cannot find module '@repo/...'

Make sure you have run `npm run build` first to compile the shared packages.

### Error: EADDRINUSE :::3001 or :::3000

The port is already in use. Kill the process or change the port in `.env` (API) or `vite.config.ts` (UI).

### Tests fail with module errors

Run `npm install` at the project root to ensure all dependencies are installed.

## Workspace Structure

The project uses npm workspaces. Internal dependencies are resolved automatically:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

This allows `@repo/api` and `@repo/ui` to import from `@repo/use-cases` and `@repo/shared` without needing to publish the packages to npm.
