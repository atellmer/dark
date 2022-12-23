module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  clearMocks: true,
  coverageDirectory: 'coverage',
  globals: {
    'process.env.NODE_ENV': 'test',
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  moduleNameMapper: {
    '^@dark-engine/core(.*)$': '<rootDir>/packages/core/src$1',
    '^@dark-engine/platform-browser(.*)$': '<rootDir>/packages/platform-browser/src$1',
    '^@dark-engine/platform-server(.*)$': '<rootDir>/packages/platform-server/src$1',
    '^@test-utils$': '<rootDir>/test/utils',
  },
  setupFiles: ['./test/setup.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
};
