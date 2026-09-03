import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "prefer-const": "off",
    },
  },
]);

export default eslintConfig;
