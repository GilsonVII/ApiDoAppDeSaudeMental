module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  globalSetup: './tests/globalSetup.ts', 
  setupFilesAfterEnv: ['./tests/setup.ts'], 
  clearMocks: true,
  forceExit: true,
};