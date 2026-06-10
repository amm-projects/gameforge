# AGENTS.md

## Project

GameForge (working title)

2D platformer visual editor built with Next.js.

Users can create levels by placing blocks, enemies, coins, decorations and interactive objects through a drag & drop interface, without programming.

The system must allow previewing and playing the level directly from the browser.

---

# Main goal

Build a 2D platformer game creator similar to Mario Maker, but fully web-based.

The editor must generate a serializable data structure (JSON) that will later be interpreted by the game engine.

The priority is simplicity, maintainability and scalability.

---

# Tech stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## State management

- Zustand

## Game engine

- Phaser 3

## Drag & Drop

- dnd-kit

## Validation

- Zod

## Future database

- PostgreSQL
- Prisma

---

# General rules

## ALWAYS

- Use strict TypeScript.
- Use functional components.
- Keep components small.
- Separate logic from presentation.
- Create reusable types.
- Use descriptive names.
- Keep code simple.
- Prioritize clarity over premature optimization.
- Follow SOLID principles when reasonable.
- Review the project to see if everything is correct.

## NEVER

- Use JavaScript without types.
- Use `any` unless explicitly justified.
- Duplicate logic.
- Create giant components.
- Mix editor logic with runtime logic.
- Introduce unnecessary dependencies.
- Modify existing architecture without explaining why.

---

# Architecture philosophy

The project is divided into two completely separate worlds.

## Editor

Allows building levels.

### Responsibilities

- Draw tiles.
- Place entities.
- Configure properties.
- Save levels.
- Load levels.

The editor does NOT contain game logic.

---

## Runtime

Executes levels.

### Responsibilities

- Physics.
- Collisions.
- Movement.
- Enemy AI.
- Coin collection.
- Victory conditions.

The runtime does NOT contain editing tools.

---

# Folder structure

```text
src/
├── app/
├── components/
├── features/
├── engine/
│   ├── editor/
│   └── runtime/
├── store/
├── hooks/
├── lib/
├── types/
└── assets/
```

---

# Tile System

Tiles are the foundation of the stage.

Each tile has:

- id
- name
- category
- sprite
- solid (boolean)

Examples:

- Ground
- Brick
- Platform
- Spike

Tiles are placed on a grid.

Initial size:

```text
32x32 px
```

---

# Entity System

Entities are objects with behavior.

Examples:

- Player
- Coin
- Enemy
- Checkpoint
- Goal
- Door
- Key

All entities must share a base structure.

```ts
interface Entity {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  properties: Record<string, unknown>;
}
```

---

# Level format

Levels must be serializable to JSON.

The format must be independent of Phaser.

Never store Phaser objects inside the data.

---

# State management

Use Zustand.

Separate stores by domain:

- editorStore
- projectStore
- selectionStore
- runtimeStore

Avoid monolithic stores.

---

# Performance

- Avoid unnecessary re-renders.
- Use memoization only when there is a demonstrated need.
- Keep the editor smooth with large maps.
- Avoid heavy computations during render.

---

# Lighthouse

The project must maintain a score of **100 in all categories** of Lighthouse:

| Category | Target |
|---|---|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Rules

- Audit with Lighthouse on **desktop**, **tablet** and **mobile** before each release.
- Do not introduce changes that degrade any score below 100.
- If a technical constraint prevents 100, document the exception in `/docs` with a mitigation plan.
- Prioritize semantic tags (`<header>`, `<main>`, `<section>`, `<button>`) and ARIA roles where applicable.
- Ensure sufficient color contrast in all themes.
- Provide alternative text (`alt`, `aria-label`) on all interactive and decorative elements.
- Use relative font sizes (`rem`/`em`) and media queries to adapt to tablet and mobile.
- Optimize images and assets for each viewport.

---

# Security (OWASP Top 10)

## A01:2021 – Broken Access Control

- Do not expose internal API routes without validation.
- If roles are implemented (admin/editor/viewer), verify permissions on each operation.
- Do not trust client data for authorization decisions.

## A02:2021 – Cryptographic Failures

- Do not transmit or store passwords without encryption (bcrypt/Argon2).
- Use HTTPS in production.
- Do not invent your own cryptographic algorithms.

## A03:2021 – Injection

- Validate and sanitize all level JSON loaded by the user before parsing.
- Never use `eval()`, `new Function()` or dangerous templates.
- All user input (textareas, imports) must pass strict type validation (Zod).

## A04:2021 – Insecure Design

- Model threats before implementing critical features (authentication, payments, APIs).
- Establish rate limiting on future public endpoints.
- Do not assume the client is trustworthy; always validate on the server.

## A05:2021 – Security Misconfiguration

- Do not expose sensitive information on the client side (keys, internal URLs).
- Keep dependencies up to date.
- Disable unnecessary Phaser/Next.js features in production.

## A06:2021 – Vulnerable and Outdated Components

- Review dependencies periodically with `npm audit`.
- Do not introduce unnecessary dependencies (see NEVER rules).

## A07:2021 – Identification and Authentication Failures

- If authentication is implemented in the future, use secure sessions (NextAuth).
- Do not store tokens or credentials in Zustand or localStorage without encryption.

## A08:2021 – Software and Data Integrity Failures

- Validate that loaded assets (sprites, JSON) do not contain malicious code.
- Verify integrity of imported levels before loading them into the runtime.

## A09:2021 – Security Logging and Monitoring Failures

- Do not print sensitive data in `console.log` / `console.error`.
- Capture JSON parse errors without exposing the full content.

## A10:2021 – Server-Side Request Forgery (SSRF)

- If import/export APIs are implemented, validate and restrict URLs.
- Do not allow fetch to arbitrary destinations from the server.

---

# UI

Design inspired by professional tools.

Main panels:

- Asset explorer
- Central canvas
- Inspector
- Top toolbar

The interface must be optimized for desktop.

Mobile will be a secondary priority.

---

# Testing

## Testing stack

| Type | Tool | Purpose |
|---|---|---|
| Unit | Vitest | Critical logic, stores, utilities, serialization |
| Integration | Testing Library | React components, user interactions |
| E2E | Playwright | Full flows (editor, runtime, export/import) |

## Vitest (unit)

- Tests should be located next to the file they test with `.test.ts` or `.test.tsx` suffix.
- Cover: Zustand stores, level serialization/deserialization, paint logic, editor tools.
- Do not mock Phaser. Separate pure logic (types, transformations) to test without Phaser.

```ts
// example: editorStore.test.ts
import { describe, it, expect } from 'vitest';
```

## Testing Library (integration)

- Tests in `.test.tsx` files next to the component.
- Test: component rendering, clicks, simulated dnd-kit drag & drop, tile/entity selection, canvas interaction.
- Use `@testing-library/react`, `@testing-library/user-event`.

```ts
// example: ToolPanel.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

## Playwright (E2E)

- Tests in `e2e/` with `.spec.ts` suffix.
- Cover: page load, painting tiles on canvas, placing entities, erasing, JSON export, JSON import, opening runtime and seeing the game working.
- Use `@playwright/test`.

```ts
// example: e2e/editor.spec.ts
import { test, expect } from '@playwright/test';
```

## Commands

```text
npm run test        → Vitest (unit + integration)
npm run test:e2e    → Playwright
npm run test:run    → CI Vitest (no watch)
```

## Rules

- Follow TDD (Test Driven Development):
  1. Write the failing test first.
  2. Implement the minimum code to pass.
  3. Refactor keeping tests green.
- Do not commit code without tests if the functionality is testable.
- Keep tests fast (< 100ms per unit test).
- Do not test Phaser internal implementation. Test only application logic.

## Continuous verification

- After each feature: `npm run test:run && npm run build`
- After changes to critical flows: add `npm run test:e2e`
- At the end: `npm run lint && npm run test:run && npm run build`

---

# Conventions

## Components

PascalCase

```text
TilePalette.tsx
EntityInspector.tsx
LevelCanvas.tsx
```

## Hooks

```text
useEditorCamera.ts
useTileBrush.ts
```

## Stores

```text
editorStore.ts
projectStore.ts
```

## Types

All shared types should be located in:

```text
src/types
```

---

# Layer System

The editor will initially work with the following layers:

```text
Layer 0 → Background
Layer 1 → Decoration
Layer 2 → Solid tiles
Layer 3 → Enemies
Layer 4 → Objects
Layer 5 → Player
```

Layers must be independent and editable.

---

# Camera System

The editor camera must support:

- Zoom
- Pan
- Auto center
- Fit to map

Camera state must be separated from level state.

---

# Mandatory documentation (VERY IMPORTANT)

Each relevant action performed by the AI assistant must be documented.

## Main rule

- Every functional, architectural or feature change must generate documentation.

## Documentation folder

```text
/docs
```

## Documentation format

Files must be Markdown (.md) and follow the structure defined in Keep a Changelog:
https://keepachangelog.com/en/1.0.0/

## What to document

The assistant must always document:

- New features
- Architecture changes
- New systems
- Important technical decisions
- External integrations
- Changes to the level JSON format
- Relevant bugs and solutions

---

# Mandatory versioning

Each time the assistant makes a change to the code:

## 1. Versioning in package.json

- Increment the version following SemVer:
  - patch → bugfix
  - minor → new compatible features
  - major → incompatible changes

## 2. CHANGELOG.md mandatory

Each change must be reflected in:

```text
/CHANGELOG.md
```

It must strictly follow the format of:

https://keepachangelog.com/en/1.0.0/

### Changelog rules

- Use sections:
  - Added
  - Changed
  - Fixed
  - Removed
  - Security
- Each entry must be clear and technical
- Must include change date
- Must be updated on each relevant modification

---

# Important decisions

If multiple solutions are possible:

1. Choose the simplest.
2. Choose the most maintainable.
3. Choose the easiest to understand.
4. Document the decision.

---

# Rule for AI assistants

Before generating code:

1. Analyze the existing architecture.
2. Reuse existing components.
3. Reuse existing types.
4. Do not create duplicate files.
5. Briefly explain important decisions.
6. Maintain consistency with this document.

If a request contradicts AGENTS.md:

- Do not implement immediately.
- First explain the conflict.
- Propose compatible alternatives.

---

# MVP Scope

The first version must allow:

- Creating a level.
- Drawing tiles.
- Placing player.
- Placing enemies.
- Placing coins.
- Saving the level.
- Loading the level.
- Testing the level in real time.

Everything else is considered future functionality.
```