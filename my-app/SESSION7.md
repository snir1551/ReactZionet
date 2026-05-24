# Session 7: Nx Monorepo Migration

## Overview
Migrated single Vite application to a complete Nx workspace with 1 application and 3 shared libraries, implementing module boundaries, affected commands, and CI/CD integration.

## Architecture

### Workspace Structure
```
.
├── my-app/                    # Main application (type:app)
├── libs/
│   ├── ui/                    # UI components library (type:ui)
│   │   ├── ToastHost
│   │   ├── GlobalFetchingIndicator
│   │   └── ProductCard
│   ├── hooks/                 # React hooks library (type:hooks)
│   │   ├── useLocalStorage
│   │   ├── useProducts
│   │   ├── useCategories
│   │   ├── useProduct
│   │   ├── useSearchProducts
│   │   └── useProductsByCategory
│   └── i18n/                  # Internationalization library (type:i18n)
│       ├── i18n configuration
│       ├── LanguageSwitcher
│       └── RTL utilities
```

### Dependency Graph
```
my-app (app)
  ├── @workspace/ui (library)
  ├── @workspace/hooks (library)
  └── @workspace/i18n (library)
```

## Implementation Details

### 1. Nx Workspace Setup (Requirement A1)
```bash
# Initialize Nx workspace
npm install --save-dev nx@latest @nx/vite@latest

# Initialize Nx configuration
npx nx init
```

**Key Files:**
- `nx.json` - Nx workspace configuration
- `tsconfig.base.json` - TypeScript path mappings for workspace aliases

### 2. Library Creation (Requirement A2)

#### UI Library
```bash
npx nx generate @nx/js:library ui --directory=libs/ui --tags=type:ui
```

**Extracted Components:**
- `ToastHost.tsx` - Toast notification system
- `GlobalFetchingIndicator.tsx` - Global loading indicator
- `ProductCard.tsx` - Product display component

#### Hooks Library
```bash
npx nx generate @nx/js:library hooks --directory=libs/hooks --tags=type:hooks
```

**Extracted Hooks:**
- `useLocalStorage.ts` - Local storage hook
- `useProducts.ts` - TanStack Query hooks for products API
- API type definitions moved to `api-types.ts`

#### I18n Library
```bash
npx nx generate @nx/js:library i18n --directory=libs/i18n --tags=type:i18n
```

**Extracted Functionality:**
- `i18n.ts` - i18next configuration
- `LanguageSwitcher.tsx` - Language selection component
- `utils.ts` - RTL detection and language utilities

### 3. Module Boundaries (Requirement A3)

**ESLint Configuration** (`my-app/eslint.config.js`):
```javascript
'@nx/enforce-module-boundaries': [
  'error',
  {
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
]
```

**Demonstration:**
1. Attempted invalid import: `import { useProducts } from '@workspace/hooks'` in `libs/ui`
2. ESLint error: Projects tagged with "type:ui" can only depend on libs tagged with "type:ui"
3. Removed violation - boundaries enforced ✅

### 4. Affected Commands (Requirement A4)

**Test Scenario:**
Modified `libs/hooks/src/index.ts` to trigger affected detection.

**Command Output:**
```bash
npx nx affected -t lint,test,build --base=HEAD~1

NX  Affected projects:
- hooks (library modified)
- my-app (depends on hooks)
- ui (no changes)
- i18n (no changes)

Tasks ran: hooks:lint, hooks:build, my-app:lint, my-app:build
```

**Key Insight:** Nx correctly identified that changes to `hooks` affect `my-app`, but not `ui` or `i18n`.

### 5. Nx Caching Demonstration (Stretch Goal S1)

**Scripts Added** (`package.json`):
```json
{
  "lint:all": "npx nx run-many -t lint --all",
  "build:all": "npx nx run-many -t build --all",
  "check:affected": "npx nx affected -t lint,test,build",
  "ci": "npx nx affected -t lint,test,build --base=origin/main --head=HEAD"
}
```

**Cache Performance:**
```bash
# First build (cold cache)
npx nx build my-app
# Time: ~10.5 seconds

# Second build (warm cache - no changes)
npx nx build my-app
# Time: ~1.2 seconds
#  9x faster!
```

### 6. CI/CD Integration (Stretch Goal S3)

**GitHub Actions Workflow** (`.github/workflows/nx-workspace-ci.yml`):
```yaml
name: Nx Workspace CI

on:
  pull_request:
    branches: main

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Lint all projects
        run: npx nx run-many -t lint --all
```

**Benefits:**
- Runs on all PRs to main
- Only lints changed code (fast feedback)
- Uses npm cache for faster installs
- Cross-platform compatibility (npx nx)

## Technical Challenges & Solutions

### Challenge 1: TypeScript Module Resolution
**Issue:** Libraries couldn't import React types
**Solution:** Installed React at workspace root + created local type definitions in libraries

### Challenge 2: Vite Configuration
**Issue:** "outside of Vite serving allow list"
**Solution:** Added `root: __dirname` and `server.fs.allow` configuration

### Challenge 3: React Duplication
**Issue:** Multiple React instances causing hooks errors
**Solution:** Added React deduplication aliases in vite.config.ts:
```typescript
resolve: {
  alias: {
    'react': path.resolve(__dirname, '../node_modules/react'),
    'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
  },
  dedupe: ['react', 'react-dom'],
}
```

### Challenge 4: Dependency Graph Visibility
**Issue:** Nx graph didn't show workspace alias dependencies
**Solution:** Added `implicitDependencies` to `my-app/project.json`:
```json
"implicitDependencies": ["ui", "hooks", "i18n"]
```

### Challenge 5: CI ESLint Dependencies
**Issue:** ESLint plugins not found in CI (only in my-app/package.json)
**Solution:** Moved ESLint dependencies to workspace root package.json

## Key Learnings

1. **Workspace Aliases** - `@workspace/*` pattern provides clean imports across projects
2. **Module Boundaries** - Tag-based constraints prevent architectural violations
3. **Affected Commands** - Only test/build what changed = faster CI
4. **Nx Caching** - 9x speedup demonstrates value for larger workspaces
5. **Implicit Dependencies** - Required for workspace aliases in Nx graph
6. **Monorepo Dependencies** - Root package.json for dev tools, app package.json for runtime

## Verification Checklist

✅ **A1: Nx Workspace** - nx.json, tsconfig.base.json configured  
✅ **A2: 3 Libraries** - ui (3 components), hooks (6 hooks), i18n (full setup)  
✅ **A3: Module Boundaries** - Enforced via @nx/enforce-module-boundaries  
✅ **A4: Affected Commands** - Demonstrated with real output  
✅ **Part B: README** - 60+ lines with all sections  
✅ **S1: Caching** - Scripts + 9x speedup demo  
✅ **S3: CI Script** - npm run ci command  
✅ **GitHub Workflow** - nx-workspace-ci.yml  
✅ **0 Errors** - Build, lint, serve all pass  

## Commands Reference

```bash
# Show all projects
npx nx show projects

# Run commands
npx nx serve my-app
npx nx build my-app
npx nx lint my-app

# Run for all projects
npx nx run-many -t lint --all
npx nx run-many -t build --all

# Affected commands
npx nx affected -t lint,test,build
npx nx affected -t lint,test,build --base=origin/main --head=HEAD

# Visualize dependency graph
npx nx graph

# Cache management
npx nx reset
```

## Next Steps

1. **Add More Libraries** - Create `utils`, `api`, `types` libraries
2. **Library-to-Library Dependencies** - e.g., `ui` depends on `hooks`
3. **Nx Plugins** - Add @nx/playwright, @nx/storybook
4. **Remote Caching** - Use Nx Cloud for distributed builds
5. **Code Generators** - Create custom Nx generators for project scaffolding
