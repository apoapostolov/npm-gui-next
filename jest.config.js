module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  roots: ['<rootDir>/tests'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/tests/setup-tests.js'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json',
      },
    ],
  },
  modulePathIgnorePatterns: [
    '<rootDir>/tests/test-project-npm/',
    '<rootDir>/tests/test-project-pnpm/',
    '<rootDir>/tests/test-project-yarn/',
  ],
};
