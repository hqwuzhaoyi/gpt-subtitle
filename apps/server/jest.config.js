module.exports = {
  rootDir: "src",
  roots: ["<rootDir>"],
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
  preset: "ts-jest",
  coverageReporters: ["json-summary", "text", "lcov"],
};