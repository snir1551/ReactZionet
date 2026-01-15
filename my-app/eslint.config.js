import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import nxPlugin from '@nx/eslint-plugin'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@nx': nxPlugin,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:ui', 'type:hooks', 'type:i18n'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui'],
            },
            {
              sourceTag: 'type:hooks',
              onlyDependOnLibsWithTags: ['type:hooks'],
            },
            {
              sourceTag: 'type:i18n',
              onlyDependOnLibsWithTags: [],
            },
          ],
        },
      ],
    },
  },
])
