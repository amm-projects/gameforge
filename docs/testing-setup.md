# Testing Setup

## [0.7.0] - 2026-06-04

### Added

- Stack de testing completo configurado:
  - **Vitest**: tests unitarios (`.test.ts`, `.test.tsx`)
  - **Testing Library**: tests de integración de componentes React
  - **Playwright**: tests E2E (`e2e/*.spec.ts`)

### Configuration

#### Vitest

- Archivo: `vitest.config.ts`
- Entorno: jsdom. Plugin: `@vitejs/plugin-react`. Alias: `@/` → raíz del proyecto.
- Globals activados. Pattern: `**/*.test.{ts,tsx}`.

#### Playwright

- Archivo: `playwright.config.ts`
- Test dir: `./e2e`. Pattern: `*.spec.ts`. baseURL: `http://localhost:3000`.
- Headless: true. webServer: levanta `npm run dev` automáticamente.

### Dependencies

- `vitest`, `@vitejs/plugin-react`, `jsdom`
- `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- `@playwright/test`

### Rules

- Tests unitarios < 100ms.
- No mockear Phaser. Testear solo lógica pura.
- Tests de integración con `@testing-library/react` y `userEvent`.
- No commitea código sin test si la funcionalidad es testeable.
