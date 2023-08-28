const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json", // 请替换为实际的路径
    },
  },
  moduleNameMapper: {
    "^lib/(.*)$": "<rootDir>/lib/$1",
    "^app/(.*)$": "<rootDir>/app/$1",
    "^atoms/(.*)$": "<rootDir>/atoms/$1",
    "^components/(.*)$": "<rootDir>/components/$1",
    "^hooks/(.*)$": "<rootDir>/hooks/$1",
  },
  coverageReporters: ["json-summary", "text", "lcov"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

console.log("Jest Config:", createJestConfig(customJestConfig));
