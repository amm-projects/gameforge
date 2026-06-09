# Testing Setup

## [0.7.0] - 2026-06-04

### Added

- Full testing stack configured:
  - **Vitest**: unit tests (`.test.ts`, `.test.tsx`)
  - **Testing Library**: React component integration tests
  - **Playwright**: E2E tests (`e2e/*.spec.ts`)

### Configuration

#### Vitest

- File: `vitest.config.ts`
- Environment: jsdom. Plugin: `@vitejs/plugin-react`. Alias: `@/` → project root.
- Globals enabled. Pattern: `**/*.test.{ts,tsx}`.

#### Playwright

- File: `playwright.config.ts`
- Test dir: `./e2e`. Pattern: `*.spec.ts`. baseURL: `http://localhost:3000`.
- Headless: true. webServer: starts `npm run dev` automatically.

### Dependencies

- `vitest`, `@vitejs/plugin-react`, `jsdom`
- `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- `@playwright/test`

### Rules

- Unit tests < 100ms.
- Do not mock Phaser. Test only pure logic.
- Integration tests with `@testing-library/react` and `userEvent`.
- Do not commit code without tests if the functionality is testable.
