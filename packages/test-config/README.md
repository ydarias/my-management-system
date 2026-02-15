# @repo/test-config

Shared Jest configuration for all monorepo packages.

## Usage

In your package's `jest.config.js`:

```javascript
const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'your-package',
  // Add package-specific configuration here
};
```

## Features

- `ts-jest` preset for TypeScript support
- Import path aliases with `@/`
- Code coverage configured
- 10-second timeout per test
- Support for `.spec.ts` and `.test.ts` files
