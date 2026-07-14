import { qwikEslint9Plugin } from "eslint-plugin-qwik";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/*.log",
      "**/.DS_Store",
      "*.local",
      "dist",
      "server",
      "tmp",
      "node_modules",
      ".qwik",
      "vite.config.ts.timestamp-*",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [
      ...tseslint.configs.recommended,
      ...qwikEslint9Plugin.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);
