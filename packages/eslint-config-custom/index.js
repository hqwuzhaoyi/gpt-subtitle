module.exports = {
  extends: ["next", "turbo", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["unused-imports"],
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
