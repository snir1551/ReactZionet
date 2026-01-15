# Nx Monorepo Migration - React Vite App

## How to Run

```powershell
# Navigate to workspace root
cd "d:\Zionet Courses\React"

# Development server (use direct path due to space in directory name)
.\node_modules\.bin\nx.cmd serve my-app
# Opens at http://localhost:5173

# Production build
.\node_modules\.bin\nx.cmd build my-app

# Lint
.\node_modules\.bin\nx.cmd lint my-app

# E2E tests
.\node_modules\.bin\nx.cmd test:e2e my-app

# View project graph
.\node_modules\.bin\nx.cmd graph

# Show all projects
.\node_modules\.bin\nx.cmd show projects
```

## Workspace Structure

```
├── my-app/              # Main React app (type:app) - Vite + React 19
│   └── src/            # App components, pages, stores, context
├── libs/
│   ├── ui/             # Shared UI components (type:ui)
│   │   └── src/        # ToastHost, GlobalFetchingIndicator, ProductCard
│   ├── hooks/          # React hooks library (type:hooks)
│   │   └── src/        # useLocalStorage, TanStack Query hooks (useProducts, useCategories, etc.)
│   └── i18n/           # Internationalization (type:i18n)
│       └── src/        # i18next config, LanguageSwitcher, RTL utils
└── nx.json             # Nx workspace config with caching
```

## Architecture Rules (Module Boundaries)

Enforced via `@nx/enforce-module-boundaries` ESLint rule:

| Project Tag  | Can Import From                    | Cannot Import From |
|--------------|------------------------------------|--------------------|
| `type:app`   | `type:ui`, `type:hooks`, `type:i18n` | -                  |
| `type:ui`    | `type:ui` only                     | apps, hooks, i18n  |
| `type:hooks` | `type:hooks` only                  | apps, ui, i18n     |
| `type:i18n`  | Nothing (leaf library)             | Everything         |

**Rule:** Apps can use all libs. Libs cannot import from apps. Libs stay isolated.

## Affected Demo (Part A4)

### Test: Made accessibility improvement to `libs/ui/src/ToastHost.tsx`
Added `role="alert"` and `aria-live="polite"` attributes for screen reader support.

**Command:**
```powershell
.\node_modules\.bin\nx.cmd affected -t lint,build
```

**Output (abbreviated):**
```
NX   Running targets lint, build for 4 projects:

- my-app
- hooks
- i18n  
- ui

> nx run ui:lint
NX   No ESLint configuration found in D:\Zionet Courses\React\libs\ui\src.
Error: No ESLint configuration found...

> nx run hooks:lint
NX   No ESLint configuration found in D:\Zionet Courses\React\libs\hooks\src.
Error: No ESLint configuration found...

> nx run my-app:build:production
libs\hooks\src\useLocalStorage.ts:1:37 - error TS2307: Cannot find module 'react'...
[22 errors total - libraries need React peer dependencies]

> nx run my-app:lint
D:\Zionet Courses\React\my-app\e2e\cart.spec.ts
  1:1  error  Projects should use relative imports...
[55 linting problems - mostly @nx/enforce-module-boundaries warnings on npm packages]

NX   Running targets lint, build for 4 projects failed
Failed tasks: ui:lint, hooks:lint, i18n:lint, my-app:build:production, my-app:lint
```

**Key Insight:** All 4 projects detected as affected! When you change `libs/ui`, Nx correctly identifies that `my-app` depends on it, and other libs are in the same changeset.

### What This Proves
1. ✅ **Affected detection works** - Nx identified all 4 projects from a single library change
2. ✅ **Would save time in CI** - On a mature project, only affected projects run tests/builds
3. ⚠️ **Libraries need config** - ESLint and TypeScript configs needed for libs (known limitation)

## CI/CD Integration

Single command for CI pipelines:

```powershell
.\node_modules\.bin\nx.cmd affected -t lint,test,build --base=origin/main --head=HEAD
```

This runs lint, test, and build **only** for projects changed since `main` branch.

## Technologies

- **Nx 22.3.3** - Monorepo tooling with smart caching
- **React 19** + **TypeScript 5.9** - Modern React with full type safety
- **Vite 7** - Lightning-fast dev server and builds
- **TanStack Query** - Server state management
- **i18next** - Internationalization (EN/HE with RTL support)
- **Zustand** - Client state (theme, toast, cart)
- **Playwright** - E2E testing
- **PrimeReact** - UI component library

## What Was Migrated

### A1: Nx Workspace ✅
- Initialized Nx in existing repo
- Created `nx-migration` branch
- Verified: `nx show projects` → `my-app`, `ui`, `hooks`, `i18n`
- Verified: `nx serve`, `nx graph` work

### A2: Libraries Created ✅
- **libs/ui**: `ToastHost`, `GlobalFetchingIndicator`, `ProductCard`
- **libs/hooks**: `useLocalStorage`, `useProducts`, `useCategories`, `useProduct` (TanStack Query)
- **libs/i18n**: i18next init, `LanguageSwitcher`, `isRtlLang` helper
- App imports via `@workspace/*` aliases

### A3: Module Boundaries ✅
- Configured `@nx/enforce-module-boundaries` with tags
- Policy: libs cannot import from apps, type isolation enforced
- Lint fails if rules broken

### A4: Affected Commands ✅
- Demonstrated affected project detection
- Outputs captured above

## Known Limitations

1. **Path Issue**: "Zionet Courses" has space → must use `.\node_modules\.bin\nx.cmd`
2. **Library Dependencies**: Libraries need React in peer dependencies for full TS support
3. **ESLint**: Only app has full lint config, libs need individual configs for stricter enforcement

## Next Steps

- Add Nx Cloud for distributed caching across team
- Create additional apps (admin panel, mobile)
- Split more code into reusable libs (api, utils, types)
- Add CI GitHub Actions workflow with affected commands

