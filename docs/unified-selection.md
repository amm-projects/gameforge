# Unified Selection

## [0.4.0] - 2026-06-03

### Changed

- `selectionStore.ts`: `selectedTile` and `selectedEntity` are now mutually exclusive.
- `setSelectedTile` clears `selectedEntity` and sets `activeTool = "tile"`.
- `setSelectedEntity` clears `selectedTile` and sets `activeTool = "entity"`.
- `ToolPanel.tsx`: `TileRow` and `EntityRow` no longer need to call `setActiveTool` manually.
- `LevelCanvas.tsx`: `makeAction` returns `null` if there is no active selection.

### Motivation

Previously, a tile and entity could be selected simultaneously, causing confusion in the UI. With this change, only one element is active at a time.
