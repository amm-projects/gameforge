# Changelog

All notable changes to this project will be documented in this file.

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
