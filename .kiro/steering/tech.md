---
inclusion: always
---

# Technology Stack

## Build System & Tooling

- **Build Tool**: Vite 4.5.14
- **Package Manager**: npm
- **TypeScript**: 4.9.5 with strict mode enabled
- **Module System**: ESNext with bundler resolution

## Core Framework & Libraries

- **React**: 18.3.1 with TypeScript
- **Router**: React Router DOM 6.15.0 (HashRouter)
- **State Management**:
  - Recoil 0.7.7 for global state
  - TanStack Query 5.83.0 for server state
- **UI Framework**: Material-UI (MUI) 5.14.7
- **Styling**:
  - SASS/SCSS for component styles
  - Emotion for CSS-in-JS
  - RTL support via stylis-plugin-rtl

## Key Dependencies

- **HTTP Client**: Axios 1.7.3 with custom interceptors
- **Forms**: React Hook Form 7.51.1
- **Tables**: Material React Table 3.0.1 with TanStack Virtual
- **Charts**: Recharts (via @types/recharts)
- **Date Handling**: date-fns, dayjs, moment
- **Excel Export**: ExcelJS 4.4.0
- **Notifications**: React Hot Toast 2.4.1
- **Icons**: MUI Icons, React Icons

## Common Commands

```bash
# Development server (with host access)
npm run dev

# Production build (relative base path for SAP deployment)
npm run build

# Format HTML files
npm run format

# Deploy to SAP system
npm run deploy

# Full deployment pipeline
npm run full-deploy

# Preview production build
npm preview
```

## Environment Configuration

The app supports multiple deployment environments:

- **Development**: Local development with mock data
- **Army Network**: SAP ECC integration with CSRF token authentication
- **Demo/TS Network**: Standalone mode with mock interceptor

Environment variables (via Vite):

- `VITE_APP_NETWORK`: "army" or "ts"
- `VITE_APP_BASE_URL`: API base path
- `VITE_APP_DEVELOP_BASE_URL`: Development API URL

## TypeScript Configuration

- Strict type checking enabled
- Path alias: `@assets/*` → `src/assets/*`
- Target: ES2022
- JSX: react-jsx
- Bundler module resolution
