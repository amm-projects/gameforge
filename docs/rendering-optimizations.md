# Rendering Optimizations

## [0.6.0] - 2026-06-03

### Fixed

- **4096 nodos DOM**: grid 64×64 renderizaba todas las celdas como `<button>`. Implementado virtual DOM grid: solo se crean nodos para celdas ocupadas. Vacías representadas con fondo CSS `background-image` linear-gradient. ~99% menos nodos DOM.

- **4096 `useDroppable` hooks**: cada celda registrada como droppable en dnd-kit. Reemplazado por un único droppable en el contenedor del grid.

- **Actualizaciones individuales**: cada celda pintada disparaba actualización separada del store. Implementado `batchPaint` que aplica múltiples acciones en una sola actualización de estado.

- **Sin React.memo**: todas las celdas se re-renderizaban al cambiar cualquier estado. `GridCell` envuelto en `React.memo` con selectores granulares.

### Changed

- `stores/editorStore.ts`: nuevo `batchPaint`, exportado `PaintAction`.
- `components/editor/LevelCanvas.tsx`: grid virtual, droppable único, batching, memo, selectores granulares.
- `components/EditorShell.tsx`: cálculo de celda por coordenadas.
