module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
    testMatch: ["**/?(*.)+(spec|test).ts"],
  };
  