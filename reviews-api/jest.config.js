export default {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    transform: {},
    testMatch: ['**/tests/**/*.test.js'],
    testTimeout: 10000,
    clearMocks: true,
    verbose: true,
    injectGlobals: true,
    globals: {
        'jest': true
    }
};