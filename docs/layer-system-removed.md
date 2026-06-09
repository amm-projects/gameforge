# Layer System Removed

## [0.35.1] - 2026-06-09

### Removed

- Entire layer system removed from the editor.
- `LayerBar.tsx` and `LayerBar.test.tsx` deleted.
- `layerStore.ts` and `layerStore.test.ts` deleted.
- `LAYERS`, `LAYER_NAMES`, `LAYER_VISIBLE_DEFAULT` constants removed from `types/level.ts`.
- `Layer` type removed from `types/level.ts`.
- `layer?: Layer` field removed from the `Tile` interface in `types/level.ts`.
- `layer` field removed from the Zod `tileSchema` in `types/level.schema.ts`.
- `layer` field removed from `PaintAction` in `paint-actions.ts`.
- `visibleLayers` filter removed from `LevelCanvas`; now renders all tiles directly.
- `activeLayer` reference removed from `EditorShell.handleDragEnd`.
- `layerStore` exports removed from `features/editor/index.ts`.

### Reason

The layer system was implemented early in the project but proved unnecessary for the MVP. Tiles are placed on a single grid without needing layer ordering. The added complexity (store, component, constants, canvas filters) was not justified. It can be reintroduced in the future if multi-layer editing is required.

### Impact

- **JSON format**: the `layer` field is no longer serialized or expected in levels. Existing levels that include `layer` will be parsed correctly (Zod ignores extra fields by default).
- **UI**: the layer selector (LayerBar) no longer appears in the canvas toolbar.
- **Store**: ~80 lines of Zustand code removed.
- **Tests**: 2 test files removed (~40 assertions).

### Files modified

- `src/stores/layerStore.ts` — deleted
- `src/stores/layerStore.test.ts` — deleted
- `src/components/editor/LayerBar.tsx` — deleted
- `src/components/editor/LayerBar.test.tsx` — deleted
- `src/types/level.ts` — removed constants and Layer type
- `src/types/level.schema.ts` — removed layer field from tileSchema
- `src/engine/editor/paint-actions.ts` — removed layer field from PaintAction
- `src/components/editor/LevelCanvas.tsx` — removed visibleLayers filter
- `src/components/EditorShell.tsx` — removed activeLayer reference
- `src/features/editor/index.ts` — removed layerStore export
