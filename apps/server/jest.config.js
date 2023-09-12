module.exports = {
  rootDir: ".",
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testRegex: ".spec.ts$",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Adjust the right-hand side to match your project structure
  },
  preset: "ts-jest",
  coverageReporters: ["json-summary", "text", "lcov"],
};
