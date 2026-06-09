# GameForge Level Editor

## Overview

2D level editor with grid, tile and entity support. Independent from the runtime, it only manages level creation and serialization.

### Main components

- `EditorShell`: central component that combines the tool panel, canvas and inspector.
- `ToolPanel`: tool, tile and entity selection. Includes drag-and-drop with `dnd-kit`.
- `LevelCanvas`: 32x32 grid for placing tiles and entities.
- `InspectorPanel`: level information, JSON export and import.
- `GameRuntime`: level execution with Phaser 3 using serialized data.

### Stores

- `editorStore`: level state, tiles and entities.
- `selectionStore`: active tool and current selection.
- `projectStore`: project JSON text.
- `runtimeStore`: runtime execution state.

### Level format

```json
{
  "width": 16,
  "height": 12,
  "tiles": [{ "x": 0, "y": 11, "type": "ground" }],
  "entities": [{ "id": "...", "type": "player", "x": 1, "y": 10 }]
}
```
