# GameForge

2D platformer visual editor. Build levels by dragging blocks, enemies, coins and interactive objects. Preview and play the level directly in the browser.

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **TypeScript** (strict)
- **Tailwind CSS** 4
- **Zustand** (state management)
- **Phaser** 3 (game engine)
- **dnd-kit** (drag & drop)
- **Zod** (validation)

## Requirements

- Node.js 20+

## Development

```bash
npm install
npm run dev        # development server (http://localhost:3000)
npm run build      # production build
npm run test       # unit tests (Vitest, watch mode)
npm run test:run   # unit tests (CI)
npm run test:e2e   # E2E tests (Playwright)
npm run lint       # ESLint
```

## Testing

| Type | Tool | Command |
|---|---|---|
| Unit | Vitest | `npm run test:run` |
| Integration | Testing Library | `npm run test:run` |
| E2E | Playwright | `npm run test:e2e` |

## Architecture

```
src/
├── app/            # App Router
├── components/     # React components
│   ├── editor/     #   Editor UI
│   └── runtime/    #   Runtime wrapper
├── engine/         # Game engine
│   ├── editor/     #   Editor logic
│   └── runtime/    #   Execution logic (Phaser)
├── stores/         # Global state (Zustand)
├── hooks/          # Custom hooks
├── types/          # Shared types
├── lib/            # Utilities
├── assets/         # Constants and assets
└── features/       # Feature modules
```

The editor and runtime are completely separated. The editor does not contain game logic, and the runtime does not contain editing tools.

## License

Private use.
