import baseConfig from "@dingify/eslint-config/base";
import nextjsConfig from "@dingify/eslint-config/nextjs";
import reactConfig from "@dingify/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  {
    plugins: ["jest"],
    env: {
      "jest/globals": true,
    },
    parserOptions: {
      project: ['./tsconfig.json'],
    },
    rules: {
      // TODO: Resolve errors when setting these rules to 'error'
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-definitions": "warn",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/dot-notation": "warn",
    },
  },
];
