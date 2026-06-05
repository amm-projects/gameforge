# ToolPanel: selección solo por clic

**Fecha:** 2026-06-05  
**Versión:** 0.11.0  
**Decisión técnica:** Eliminar drag & drop del panel de selección de elementos.

## Motivación

Cada fila de tile/entidad en `ToolPanel` soportaba dos modos de interacción: clic para seleccionar y arrastre para colocar directamente en el canvas. Esto duplicaba la superficie de interacción y añadía complejidad innecesaria (`useDraggable`, `DragHandle`, estado `isDragging`) para una funcionalidad que no aportaba valor significativo frente al flujo principal: seleccionar con clic y luego pintar sobre el canvas.

## Cambio

- Eliminado `useDraggable` de `TileRow` y `EntityRow`.
- Eliminado el componente `DragHandle`.
- Cada fila es ahora un `div` con `role="button"`, `tabIndex={0}` y `onClick` que selecciona el tile/entidad.
- El Preview visual se mantiene sin cambios.
- `ToolPanel.test.tsx` ya no necesita `DndContext` como wrapper.

## Impacto

- **Positivo:** menos código, menos dependencias de dnd-kit en el componente, interacción más simple y predecible.
- **Negativo:** los usuarios ya no pueden arrastrar elementos directamente desde el panel al canvas. Deben seleccionar con clic y luego pintar.

## Archivos modificados

- `components/editor/ToolPanel.tsx`
- `components/editor/ToolPanel.test.tsx`
