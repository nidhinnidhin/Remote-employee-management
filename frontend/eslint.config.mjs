import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

export default defineConfig({
  ...nextVitals,
  ...nextTs,
  rules: {
    // Add rules overrides here
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
  },
  ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
});