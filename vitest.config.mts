import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "apps/**/*.spec.ts",
      "apps/**/*.spec.tsx",
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx",
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx"
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "apps/**/e2e/**"],
    passWithNoTests: false
  }
});
