module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.{ts,js}'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
