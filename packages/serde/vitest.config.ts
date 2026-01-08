// בס"ד
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 'node' is best for pure TS logic packages; use 'jsdom' for browser-specific code
    environment: "node",
    globals: true, // Allows using describe/it/expect without importing them
    include: ["serders/**/*.test.ts"], // Target tests inside your source folder
  },
});
