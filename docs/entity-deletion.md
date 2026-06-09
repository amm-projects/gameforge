# Entity Deletion System

## [0.15.0] - 2026-06-03

### Added

- Tres formas de eliminar entidades del nivel:
  1. **Erase tool**: al activar la herramienta de borrar y hacer clic en una celda, se eliminan tile y entidad en esa posición.
  2. **Selección + tecla Delete**: al hacer clic sobre una entidad (con cualquier herramienta excepto erase), queda seleccionada y al presionar `Delete`/`Backspace` se elimina.
  3. **Indicador visual**: la entidad seleccionada muestra borde cyan (`ring-2 ring-cyan-400/50`).

### Changed

- `stores/selectionStore.ts`: añadido `selectedEntityId: string | null` y `setSelectedEntityId`.
- `components/editor/LevelCanvas.tsx`: integrados `removeEntity`, lógica de selección al clic, listener de teclado para Delete/Backspace, indicador visual en `GridCell`.
