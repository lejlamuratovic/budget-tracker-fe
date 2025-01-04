import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|react-query|react-router-dom)/)',
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS/SCSS imports
  },
  testMatch: ['**/__tests__/**/*.(spec|test).ts?(x)'], // Match test files
}; module.exports = {
  testEnvironment: "jsdom",
};

export default config;
