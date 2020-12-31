module.exports = {
  rootDir: '../../',
  roots: ['<rootDir>/src'],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupJest.ts'],
  testMatch: ['**/*.spec.*'],
  moduleFileExtensions: ['js', 'ts'],
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: ['**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '.+\\.d.ts',
    'index.ts',
    'model.ts',
    'key.ts',
    '.+\\.styles.scss',
    '.+\\.styles.css',
    'consts.ts',
    'app/common/actions.ts',
    '.+\\.spec.+(ts|tsx)$'
  ]
};
