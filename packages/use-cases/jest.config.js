const baseConfig = require('@repo/test-config/jest.config');

module.exports = {
  ...baseConfig,
  displayName: 'use-cases',
  roots: ['<rootDir>/src'],
};
