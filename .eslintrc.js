module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["google"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "max-len": [
      "error",
      80,
      2,
      {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
