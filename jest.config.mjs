// jest.config.mjs
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: "jest-environment-jsdom",

  moduleDirectories: ["node_modules", "<rootDir>"],

  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@context/(.*)$": "<rootDir>/context/$1",
    "^@helpers/(.*)$": "<rootDir>/helpers/$1",
    "^@hooks/(.*)$": "<rootDir>/components/hooks/$1",
    "^@public/(.*)$": "<rootDir>/public/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
