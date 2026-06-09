# GameForge Level Editor

## Overview

Editor de niveles 2D con soporte para grid, tiles y entidades. Independiente del runtime, solo administra la creación y serialización de niveles.

### Componentes principales

- `EditorShell`: componente central que combina panel de herramientas, canvas e inspector.
- `ToolPanel`: selección de herramientas, tiles y entidades. Incluye drag-and-drop con `dnd-kit`.
- `LevelCanvas`: cuadrícula de 32x32 para colocar tiles y entidades.
- `InspectorPanel`: información del nivel, exportación e importación de JSON.
- `GameRuntime`: ejecución del nivel con Phaser 3 usando datos serializados.

### Stores

- `editorStore`: estado del nivel, tiles y entidades.
- `selectionStore`: herramienta activa y selección actual.
- `projectStore`: texto JSON del proyecto.
- `runtimeStore`: estado de ejecución del runtime.

### Formato de nivel

```json
{
  "width": 16,
  "height": 12,
  "tiles": [{ "x": 0, "y": 11, "type": "ground" }],
  "entities": [{ "id": "...", "type": "player", "x": 1, "y": 10 }]
}
```
