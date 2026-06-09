# Rendering Optimizations

## [0.6.0] - 2026-06-03

### Fixed

- **4096 DOM nodes**: 64×64 grid rendered all cells as `<button>`. Implemented virtual DOM grid: only nodes for occupied cells are created. Empty cells rendered with CSS `background-image` linear-gradient. ~99% fewer DOM nodes.

- **4096 `useDroppable` hooks**: each cell registered as droppable in dnd-kit. Replaced with a single droppable on the grid container.

- **Individual updates**: each painted cell triggered a separate store update. Implemented `batchPaint` that applies multiple actions in a single state update.

- **No React.memo**: all cells re-rendered on any state change. `GridCell` wrapped in `React.memo` with granular selectors.

### Changed

- `stores/editorStore.ts`: new `batchPaint`, exported `PaintAction`.
- `components/editor/LevelCanvas.tsx`: virtual grid, single droppable, batching, memo, granular selectors.
- `components/EditorShell.tsx`: cell calculation by coordinates.
