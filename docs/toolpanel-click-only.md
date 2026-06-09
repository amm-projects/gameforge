# ToolPanel: selección solo por clic

## [0.11.0] - 2026-06-05

### Changed

- Eliminado drag & drop del panel de selección de elementos.
- Cada fila de tile/entidad ahora es un `div` con `role="button"`, `tabIndex={0}` y `onClick`.
- Eliminado `useDraggable` de `TileRow` y `EntityRow`.
- Eliminado componente `DragHandle`.
- Preview visual se mantiene sin cambios.
- `ToolPanel.test.tsx` ya no necesita `DndContext` como wrapper.

### Motivation

Cada fila soportaba clic y arrastre, duplicando interacción y añadiendo complejidad (`useDraggable`, `DragHandle`, estado `isDragging`) sin valor significativo frente al flujo principal: seleccionar con clic y pintar en canvas.
