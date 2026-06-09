# Entity Deletion System

## [0.15.0] - 2026-06-03

### Added

- Three ways to delete entities from the level:
  1. **Erase tool**: activate the Erase tool and click a cell; both tile and entity at that position are removed.
  2. **Selection + Delete key**: click an entity (with any tool except Erase) to select it; pressing `Delete`/`Backspace` removes it.
  3. **Visual indicator**: the selected entity shows a cyan border (`ring-2 ring-cyan-400/50`).

### Changed

- `stores/selectionStore.ts`: added `selectedEntityId: string | null` and `setSelectedEntityId`.
- `components/editor/LevelCanvas.tsx`: integrated `removeEntity`, click selection logic, keyboard listener for Delete/Backspace, visual indicator in `GridCell`.
