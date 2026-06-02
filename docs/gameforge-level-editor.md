# GameForge Level Editor

## Overview

Se agregó un editor de niveles 2D con soporte para grid, tiles y entidades. El editor es independiente del runtime y solo administra la creación y serialización de niveles.

## Componentes principales

- `EditorShell`: Componente central que combina el panel de herramientas, el canvas y el inspector.
- `ToolPanel`: Permite seleccionar herramientas, tiles y entidades. Incluye drag-and-drop con `dnd-kit`.
- `LevelCanvas`: Representa la cuadrícula de 32x32 y permite colocar tiles y entidades.
- `InspectorPanel`: Muestra información del nivel, exporta JSON y permite cargar niveles desde JSON.
- `GameRuntime`: Ejecución del nivel con Phaser 3 usando solo datos serializados.

## Stores

- `editorStore`: Estado del nivel, tiles y entidades.
- `selectionStore`: Herramienta activa y selección actual.
- `projectStore`: Texto JSON del proyecto.
- `runtimeStore`: Estado de ejecución del runtime.

## Formato de nivel

```json
{
  "width": 16,
  "height": 12,
  "tiles": [
    { "x": 0, "y": 11, "type": "ground" }
  ],
  "entities": [
    { "id": "...", "type": "player", "x": 1, "y": 10 }
  ]
}
```
