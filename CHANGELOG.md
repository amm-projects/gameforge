# Changelog

All notable changes to this project will be documented in this file.

## [0.10.0] - 2026-06-04

### Added

- Directorios `hooks/` y `lib/` con estructura inicial según convención de AGENTS.md.
- `hooks/useTileBrush.ts`: hook para encapsular lógica de pintado con batch y RAF.
- `lib/utils.ts`: utilidades compartidas (`makeId`, `clamp`, `isKeyOf`).
- `types/tile-definitions.ts`: modelo de datos de tiles con `id`, `nombre`, `categoría`, `sprite` y `sólido` según especificación de AGENTS.md.
- Entity `properties: Record<string, unknown>` para datos dinámicos por entidad.

### Changed

- `types/level.ts`: Entity ahora usa `position: { x, y }` en lugar de `x`, `y` planos, alineado con la interfaz definida en AGENTS.md.
- `types/level.schema.ts`: actualizado esquema Zod para `position` anidado y `properties` opcional con transform a objeto vacío.
- `stores/editorStore.ts`: actualizadas referencias a `entity.position.x`/`entity.position.y`.
- `components/editor/LevelCanvas.tsx`: actualizadas referencias a `entity.position`.
- `components/runtime/GameRuntime.tsx`: actualizadas referencias a `entity.position`.
- Todos los tests actualizados para la nueva interfaz Entity.

## [0.9.2] - 2026-06-04

### Added

- Documentación de excepciones Lighthouse en `docs/lighthouse-exceptions.md`.
- Auditoría Lighthouse completa en escritorio, tablet y móvil usando Edge (Chromium v148).

### Changed

- `ToolPanel.tsx`: headings `<h3>` → `<h2>` para jerarquía correcta (heading-order).
- `ToolPanel.tsx`: `text-slate-500` → `text-slate-300` en descripciones de 10px para contraste suficiente (color-contrast).
- `ToolPanel.tsx`: `aria-label` añadido a drag handles y botones de selección (aria-command-name).
- `EditorShell.tsx`: `aria-label` en Play/Stop ahora incluye texto visible (label-content-name-mismatch).
- `InspectorPanel.tsx`: `aria-label` actualizados para coincidir con texto visible.
- `GameRuntime.tsx`: `aria-label` añadido al botón Detener.
- `text-[10px]` → `text-[0.625rem]` y `text-[5px]` → `text-[0.3125rem]` para tamaños de fuente relativos.

### Fixed

- Contraste de color insuficiente en `text-[10px] text-slate-500` sobre fondo oscuro (2.17:1 → 6.81:1).

## [0.9.1] - 2026-06-04

### Added

- Schema Zod para validación de LevelData en `types/level.schema.ts` (A03).
- Tests de integración para rechazo de JSON inválido en InspectorPanel.
- Documentación de seguridad OWASP en `docs/owasp-security.md`.

### Changed

- `InspectorPanel.handleLoad` ahora usa `levelDataSchema.safeParse()` en lugar de `JSON.parse` + casteo manual.
- Error logging silenciado en `handleLoad` (A09).

### Security

- Validación estricta de tipos con Zod para todo input JSON de nivel (A03).
- Eliminada exposición de datos de usuario en `console.error` (A09).
- Ejecutado `npm audit` (A06): 2 vulnerabilidades moderadas en postcss (transitivas de Next.js).

## [0.9.0] - 2026-06-04

### Added

- Stack de testing: Vitest (unitario), Testing Library (integración), Playwright (E2E).
- `vitest.config.ts` con jsdom, plugin React y alias `@/`.
- `playwright.config.ts` con tests en `e2e/`, servidor Next.js automático.
- Scripts `test`, `test:run` y `test:e2e` en `package.json`.
- `eslint.config.mjs` ignora `e2e/` y `*.test.{ts,tsx}`.

## [0.8.1] - 2026-06-03

### Added

- Muerte al caer al vacío en el runtime. Se eliminó `setCollideWorldBounds(true)` del jugador. En `update()`, si `player.y > worldHeight + 64` se dispara `onHitSpike()` (Game Over + pausa).

## [0.8.0] - 2026-06-03

### Changed

- Selección unificada en `selectionStore`: `selectedTile` y `selectedEntity` ahora son mutuamente excluyentes. Al seleccionar un tile, se limpia `selectedEntity` y se activa el modo `"tile"`. Al seleccionar una entidad, se limpia `selectedTile` y se activa el modo `"entity"`. Los tipos cambiaron a `TileType | null` y `EntityType | null`.
- `ToolPanel.tsx`: `TileRow` y `EntityRow` ya no llaman `setActiveTool` manualmente; el store lo maneja. El highlight de entidad ya no depende de `activeTool`.

### Added

- `makeAction` en `LevelCanvas.tsx` retorna `null` si no hay tile o entidad seleccionada, evitando pintar acciones inválidas.

## [0.7.5] - 2026-06-03

### Changed

- Eliminados los botones "Pincel de tiles" y "Entidad" del panel de herramientas en `ToolPanel.tsx`. Ahora el modo se selecciona implícitamente al hacer clic en una fila de tile o entidad. Solo se conserva el botón "Borrar" como herramienta explícita.
- `TileRow` ahora también llama `setActiveTool("tile")` al hacer clic.

## [0.7.4] - 2026-06-03

### Fixed

- Los botones de selección en `ToolPanel.tsx` no funcionaban porque `useDraggable` consumía el evento de click. Se separó el activador de arrastre (preview visual) del `onClick` de selección (etiqueta). `listeners` van solo sobre el `DragHandle`, el `onClick` va sobre un `<button>` independiente.

## [0.7.3] - 2026-06-03

### Changed

- Eliminados los botones "Arrastrar" independientes en `ToolPanel.tsx`. Ahora la fila completa de cada tile/entidad es a la vez seleccionable y arrastrable mediante `useDraggable`, con un único `<button>` que maneja ambas acciones.

## [0.7.2] - 2026-06-03

### Fixed

- `button` anidado en `ToolPanel.tsx`: el `DraggableItem` renderizaba un `<button>` dentro de otro `<button>` (fila seleccionable), lo cual es HTML inválido y causaba hydration error. Se cambió a `<div>` con `cursor-grab`.

## [0.7.1] - 2026-06-03

### Fixed

- Hydration mismatch en `ToolPanel` causado por `useDraggable` (dnd-kit) generando atributos con IDs distintos entre servidor y cliente. Se cambió la importación directa a `next/dynamic` con `ssr: false` en `EditorShell.tsx`.

## [0.7.0] - 2026-06-03

### Changed

- Rediseñado el `ToolPanel` con previews visuales: cada tile y entidad muestra un cuadrado coloreado (mismos colores que el canvas y runtime), nombre legible en español, tipo técnico y un botón de arrastre con miniatura propia. La selección activa se resalta visualmente.

## [0.6.1] - 2026-06-03

### Changed

- Enemy patrol: removed the 2-second timer fallback. Enemies now reverse direction **only** when `body.blocked.left` or `body.blocked.right` is set by a tile or world-bound collision. The timer was interfering with wall-collision detection (enemies reversed before reaching walls in open areas).

## [0.6.0] - 2026-06-03

### Added

- Enemy patrol behaviour in the game runtime. Enemies move horizontally (initial velocity `80px/s`) and reverse direction when colliding with solid tiles or world bounds via `body.blocked.left` / `body.blocked.right` detection.
- Enemy movement runs before the `if (!this.player) return` guard, so enemies patrol even without a player entity.

### Changed

- Removed `bounceX: 1` from enemies (both group config and individual body). Wall collisions are now handled manually in `update()` to avoid double-reversal bugs with Phaser's automatic bounce.

## [0.5.0] - 2026-06-03

### Changed

- Replaced full 64×64 DOM grid (4096 `<button>` elements) with virtual rendering: only cells containing tiles, entities, or the selected entity generate DOM nodes. Empty cells render as a CSS `background-image` grid pattern (linear-gradient). Celdas posicionadas con `position: absolute` en lugar de CSS Grid.
- `getCellFromEvent` ahora calcula coordenadas desde la posición del mouse contra `getBoundingClientRect()` del grid cuando no se hace clic sobre un botón existente, permitiendo interactuar con celdas vacías sin elementos DOM.
- Removed `useDroppable` from all 4096 individual `GridCell` components. Replaced with a single `useDroppable` on the grid container. Drag-and-drop now calculates the target cell from pointer coordinates (`activatorEvent + delta`) in `EditorShell`.

### Added

- Paint-by-drag: holding left mouse button and dragging paints tiles/entities/erase continuously.
- Batch painting via `batchPaint` action in `editorStore` that applies multiple paint actions in a single state update. Paint changes accumulate during drag and flush via `requestAnimationFrame` (at most once per frame).

### Performance

- Reducción de ~99% de nodos DOM en nivel vacío (de 4096 a ~0).
- Eliminadas 4096 llamadas a `useDroppable` (registro en dnd-kit).
- Las actualizaciones durante pintado se bachean en una sola actualización de estado por frame.

## [0.4.0] - 2026-06-03

### Changed

- Changed default level grid from 16×12 to 64×64 cells.
- Reduced editor cell size from 40px to 10px so the 64×64 grid occupies the same visual canvas area (~640×640px).
- Increased Phaser runtime canvas limits from 1024×768 to 1280×720 for a wider viewport.
- Changed runtime container height from fixed `h-96` (384px) to `min-h-[480px]`.
- Updated grid dimension badge in LevelCanvas to show dynamic `{width}x{height}` instead of hardcoded "32x32".
- Reduced entity symbol text and selection ring size to match the smaller cells.
- Optimized `LevelCanvas` rendering performance: wrapped `GridCell` in `React.memo` to prevent re-rendering of unchanged cells, replaced inline `onClick` closures with event delegation via `data-x`/`data-y` attributes, moved grid cell generation into a `useMemo`, and switched from full-store subscriptions to granular Zustand selectors.
- Added paint-by-drag: holding left mouse button and dragging paints tiles/entities/erase continuously.
- Added batch painting via `batchPaint` action in `editorStore` that applies multiple paint actions in a single state update, then accumulates paint changes during drag and flushes via `requestAnimationFrame` (at most once per frame).
- Removed `useDroppable` from all 4096 individual `GridCell` components (the previous performance bottleneck). Replaced with a single `useDroppable` on the grid container. Drag-and-drop now calculates the target cell from pointer coordinates (`activatorEvent + delta`) instead of per-cell droppable IDs.
- Replaced full 64×64 DOM grid (4096 `<button>` elements always rendered) with virtual rendering: only cells containing tiles, entities, or the selected entity generate DOM nodes. Empty cells are rendered as a CSS `background-image` grid pattern instead. GridCells use `position: absolute` for layout. The `getCellFromEvent` fallback calculates cell coordinates from mouse position when clicking on empty areas. This reduces DOM nodes by ~99% on initial load.

## [0.3.0] - 2026-06-03

### Added

- Entity selection on the canvas: clicking an entity selects it (cyan ring indicator).
- Entity deletion via the erase tool: clicking a cell with the erase tool now removes both tiles and entities.
- Entity deletion via keyboard: pressing Delete or Backspace removes the currently selected entity.
- `selectedEntityId` state in `selectionStore` to track which entity is selected on the canvas.

## [0.2.2] - 2026-06-03

### Fixed

- Fixed Phaser runtime physics body alignment by replacing scaled 1px debug textures with runtime textures generated at their real collision sizes.
- Fixed player body sizing by using explicit runtime constants and centering the Arcade Physics body on the player sprite.

### Changed

- Runtime objects now use dedicated generated textures for ground, spikes, player, coins, goal, and enemies instead of relying on `setDisplaySize` for physics objects.

## [0.2.1] - 2026-06-03

### Fixed

- Fixed Phaser runtime collisions between the player and ground tiles by creating ground and spike tiles as static Arcade Physics bodies and refreshing their bodies after display sizing.
- Fixed static overlap bodies for coins and goals after display sizing.

### Changed

- Tightened Phaser runtime typing for dynamic imports and Arcade Physics overlap callbacks without using `any`.

## [0.2.0] - 2026-06-02

### Added

- Level editor UI with tile and entity placement.
- Grid-based painting system for 32x32 tiles.
- Support for Player, Coin, Enemy, Spike, Goal, and Ground.
- JSON export/load support for levels.
- Phaser 3 runtime that consumes level JSON and runs arcade physics.
- Zustand stores for editor state, project JSON, selection state, and runtime mode.
- Dnd-kit drag-and-drop integration for placing tiles and entities.

### Changed

- Updated application metadata and global styling for GameForge.
