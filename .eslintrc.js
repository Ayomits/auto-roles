module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-var": "error",
    semi: "error",
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "no-multiple-empty-lines": "error",
    "no-use-before-define": "error",
    "prettier/prettier": "off", // отключение проверки стиля кавычек
  },
};
