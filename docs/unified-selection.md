# Unified Selection

## 2026-06-03

### Changed

- `selectionStore.ts`: `selectedTile` y `selectedEntity` ahora son mutuamente excluyentes (`TileType | null` y `EntityType | null`). 
- `setSelectedTile` también limpia `selectedEntity` y establece `activeTool = "tile"`.
- `setSelectedEntity` también limpia `selectedTile` y establece `activeTool = "entity"`.
- `ToolPanel.tsx`: `TileRow` y `EntityRow` ya no necesitan llamar `setActiveTool` manualmente. El highlight de `EntityRow` ahora solo compara `selectedEntity === entity` (sin necesidad de verificar `activeTool`).
- `LevelCanvas.tsx`: `makeAction` retorna `null` si no hay tile o entidad seleccionada; `commitCellAction` verifica la existencia antes de pintar.

### Motivation

Antes se podía tener un tile y una entidad seleccionados simultáneamente, lo cual era confuso en la UI. Con este cambio solo hay un elemento activo a la vez, reflejando el comportamiento esperado.
