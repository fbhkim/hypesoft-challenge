import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/__tests__/(.*)$': '<rootDir>/src/__tests__/$1',
    '^@testing-library/jest-dom/extend-expect$': '<rootDir>/node_modules/@testing-library/jest-dom/extend-expect.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/tests/unit/**/*.test.[jt]s?(x)',
    '**/tests/integration/**/*.test.[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/e2e/',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
};

export default createJestConfig(customJestConfig);
