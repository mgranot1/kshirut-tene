---
inclusion: always
---

# Project Structure

## Top-Level Organization

```
src/
├── dashboard/          # Dashboard module (main feature area)
├── report/            # Report module (secondary feature area)
├── shared/            # Shared utilities and components
├── router/            # Routing configuration
├── contexts/          # React contexts
├── assets/            # Static assets (SVGs, images)
├── mock/              # Mock data and interceptors
├── App.tsx            # Root component
└── main.tsx           # Application entry point
```

## Module Structure Pattern

Both `dashboard/` and `report/` follow a consistent feature module pattern:

```
module/
├── components/        # UI components specific to this module
├── pages/            # Page-level components (route targets)
├── services/         # API services and React Query hooks
├── stores/           # Recoil state atoms and selectors
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks
└── utils/            # Utility functions
```

## Key Directories

### `/dashboard`

Main dashboard functionality with customizable screens, components, and data visualization.

**Notable subdirectories:**

- `components/ComponentCard/` - Reusable card components for graphs
- `components/DashboardFilters/` - Filter system for data
- `components/DynamicKshirutChart/` - Dynamic chart generation
- `pages/CustomScreen/` - Custom dashboard screen builder
- `pages/TopViewPage/` - Top-level organizational view
- `services/component/` - Component CRUD operations
- `services/dashboard/` - Dashboard data fetching
- `stores/` - Dashboard-specific state (filters, drill-down stack, org levels)

### `/report`

Reporting and fault management functionality.

**Notable subdirectories:**

- `pages/KshirutReport/` - Main readiness report
- `pages/FaultList/` - Fault listing and management
- `services/fault/` - Fault-related API calls
- `services/kshirutData/` - Readiness data services

### `/shared`

Cross-module shared code.

**Key subdirectories:**

- `components/` - Reusable UI components (buttons, dropdowns, popups, loaders)
- `services/` - Shared API services (families, parameters, organizational structure)
- `utils/` - Common utilities (axios instance, date handling, Excel export, constants)
- `types/` - Shared type definitions

### `/assets`

Organized by feature area:

- `assets/dashboard/` - Dashboard-specific icons and images
- `assets/report/` - Report-specific icons and images
- `assets/shared/` - Shared logos and icons
- `assets/components/` - Component-specific SVG icons

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `ComponentCard.tsx`)
- **Styles**: Match component name with `.scss` extension (e.g., `ComponentCard.scss`)
- **Services**: camelCase with `.service.ts` suffix (e.g., `dashboard.service.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGetDashboardEquipments.ts`)
- **Stores**: camelCase with `.store.ts` suffix (e.g., `DashboardData.store.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `component.types.ts`)
- **Utils**: camelCase with `.utils.ts` suffix (e.g., `dashboardData.utils.ts`)

### Code

- **Components**: PascalCase
- **Hooks**: camelCase starting with `use`
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with `I` prefix for interfaces (e.g., `IComponent`)
- **Enums**: PascalCase

## State Management

### Recoil Atoms & Selectors

Located in `*/stores/` directories:

- Atoms for mutable state (e.g., `dashboardGeneralDataAtom`)
- Selectors for derived/computed state (e.g., `dashboardFilteredGeneralData`)

### React Query

Service hooks in `*/services/` use TanStack Query:

- Query hooks: `useGet*` pattern (e.g., `useGetDashboardEquipments`)
- Mutation hooks: `useCreate*`, `useUpdate*`, `useDelete*` patterns

## Routing

- Uses HashRouter for compatibility with SAP deployment
- Routes organized by module prefix:
  - `/report/*` - Report module routes
  - `/dashboard/*` - Dashboard module routes
- Route definitions in `src/router/routes.ts`

## Styling Approach

- Component-scoped SCSS files co-located with components
- BEM-like naming convention (e.g., `.card__header`, `.card__title`)
- Global styles in `src/main.scss`
- RTL support configured at app level via Emotion cache
- MUI theme customization in `App.tsx`
