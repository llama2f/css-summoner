import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';

export default defineConfig([
  // Apply common settings first (plugins, extends, ecmaVersion)
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 2021, // Use a modern ECMAScript version
    },
  },
  // Settings for CommonJS files (most project files like cli.js, src/index.js)
  {
    files: ['**/*.js', '**/*.cjs'], // Target .js and .cjs files
    // --- Fix: Use ignores instead of excludedFiles ---
    ignores: ['test/**'], // Exclude the test directory
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // Node.js globals
      },
    },
  },
  // Settings for ES Module files (test files)
  {
    files: ['test/**/*.spec.js'], // Target test files specifically
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node, // Node might still be needed for some test helpers
        ...globals.es2021, // ES module globals
        // Define Vitest globals manually
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly', // If using vi mock functions
      },
    },
  },
]);
