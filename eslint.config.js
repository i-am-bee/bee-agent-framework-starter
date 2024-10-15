// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "package-lock.json"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.stylistic,
  prettierConfig,
  {
    rules: {
      "curly": ["error", "all"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
);
