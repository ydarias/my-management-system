const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'api',
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@repo/use-cases$': '<rootDir>/../../packages/use-cases/src/index.ts',
    '^@repo/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
};
