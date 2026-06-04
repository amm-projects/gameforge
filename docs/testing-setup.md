# Testing Setup

## Fecha
2026-06-04

## Stack

- **Vitest** — tests unitarios (`.test.ts`, `.test.tsx`)
- **Testing Library** — tests de integración de componentes React
- **Playwright** — tests E2E (`e2e/*.spec.ts`)

## Configuración

### Vitest

Archivo: `vitest.config.ts`

- Entorno: jsdom
- Plugin: `@vitejs/plugin-react` para JSX
- Alias: `@/` resuelve a la raíz del proyecto
- Globals activados
- Busca archivos `**/*.test.{ts,tsx}`

### Playwright

Archivo: `playwright.config.ts`

- Test dir: `./e2e`
- Pattern: `*.spec.ts`
- baseURL: `http://localhost:3000`
- Headless: true
- webServer: levanta `npm run dev` automáticamente

## Dependencias instaladas

### Producción

Ninguna nueva.

### Desarrollo

- `vitest`, `@vitejs/plugin-react`, `jsdom`
- `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- `@playwright/test`

## Comandos

| Comando | Propósito |
|---|---|
| `npm run test` | Vitest en modo watch |
| `npm run test:run` | Vitest en modo CI (sin watch) |
| `npm run test:e2e` | Playwright E2E |

## Reglas

- Tests unitarios < 100ms.
- No mockear Phaser. Testear solo lógica pura (tipos, stores, transformaciones).
- Tests de integración con `@testing-library/react` y `userEvent`.
- Tests E2E en `e2e/` con Playwright.
- No commitea código sin test si la funcionalidad es testeable.
