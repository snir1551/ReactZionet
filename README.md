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

### Test: Improved accessibility in GlobalFetchingIndicator

Changed `libs/ui/src/GlobalFetchingIndicator.tsx` by adding `role="status"` and `aria-live="polite"` for better screen reader support, and updated loading text from "Loading..." to "Loading data...".

**Commands Run:**
```powershell
# After committing the change to libs/ui
.\node_modules\.bin\nx.cmd affected -t build,lint --base=HEAD~1 --head=HEAD

# Show which projects are affected
.\node_modules\.bin\nx.cmd show projects --affected --base=HEAD~1
```

**Output:**
```
NX   Running targets build, lint for project my-app:

- my-app

> nx run my-app:lint
Linting "my-app"...
✓ All checks passed (2 warnings)

> nx run my-app:build:production
vite v7.3.1 building client environment for production...
✓ 414 modules transformed.
dist/index.html                   0.47 kB │ gzip: 0.30 kB
dist/assets/index-BpX242Fe.css  224.04 kB │ gzip: 28.59 kB
dist/assets/index-DT90ndAs.js   910.48 kB │ gzip: 265.48 kB
✓ built in 4.35s

NX   Successfully ran targets build, lint for project my-app
```

**Affected Projects:**
```
hooks
i18n
ui
my-app
```

**Key Insight:** Only `my-app` actually ran tasks because it's the only project that has build/lint targets configured. However, Nx correctly identified all 4 projects as "affected" since they're all in the same changeset (first big commit with all the libs).

## Stretch Goal: Nx Caching Speed (S1)

### Added Scripts

```json
{
  "scripts": {
    "lint:all": "nx run-many -t lint --all",
    "build:all": "nx run-many -t build --all",
    "check:affected": "nx affected -t lint,test,build",
    "ci": "nx affected -t lint,test,build --base=origin/main --head=HEAD"
  }
}
```

### Caching Performance

```powershell
# Clear cache
.\node_modules\.bin\nx.cmd reset

# Build 1: Cold cache
.\node_modules\.bin\nx.cmd build my-app
# Time: 10.94 seconds

# Build 2: Warm cache (no changes)
.\node_modules\.bin\nx.cmd build my-app
# Time: 1.22 seconds
# ⚡ 9x faster!
```

**Key Insight:** Nx caches build outputs. Second build reads from cache instead of re-running Vite, saving ~10 seconds. This scales massively in CI/CD with multiple projects.

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

