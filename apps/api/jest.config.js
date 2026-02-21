const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'api',
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@repo/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
};
