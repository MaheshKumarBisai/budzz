module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testTimeout: 30000,
  globalSetup: "<rootDir>/tests/jest.setup.js",
  globalTeardown: "<rootDir>/tests/jest.teardown.js",
  collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js"],
  // Only enforce coverage thresholds in CI environments. Local development
  // runs can use `npm run test:quick` to avoid failing due to coverage.
  coverageThreshold: process.env.CI
    ? {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      }
    : undefined,
};
