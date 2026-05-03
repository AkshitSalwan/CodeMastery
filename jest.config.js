export default {
  preset: null,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': 'jest-transform-stub',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|@babel)/)',
  ],
  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testMatch: [
    '**/.test/**/*.test.js',
    '!**/.test/**/*.e2e.test.js',
  ],
};