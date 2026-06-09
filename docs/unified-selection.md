# Unified Selection

## [0.4.0] - 2026-06-03

### Changed

- `selectionStore.ts`: `selectedTile` y `selectedEntity` ahora son mutuamente excluyentes.
- `setSelectedTile` limpia `selectedEntity` y establece `activeTool = "tile"`.
- `setSelectedEntity` limpia `selectedTile` y establece `activeTool = "entity"`.
- `ToolPanel.tsx`: `TileRow` y `EntityRow` ya no necesitan llamar `setActiveTool` manualmente.
- `LevelCanvas.tsx`: `makeAction` retorna `null` si no hay selección activa.

### Motivation

Antes se podía tener tile y entidad seleccionados simultáneamente, causando confusión en la UI. Con este cambio solo hay un elemento activo a la vez.
