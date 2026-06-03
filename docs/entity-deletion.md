# Entity Deletion System

## 2026-06-03

### Context

El editor permitía colocar entidades pero no había forma de eliminarlas una vez colocadas. El método `removeEntity` existía en `editorStore` pero nunca se invocaba desde la UI.

### Solución implementada

Se añadieron tres formas de eliminar entidades:

1. **Erase tool** — Al activar la herramienta de borrar y hacer clic en una celda, se eliminan tanto el tile como la entidad presentes en esa posición.

2. **Selección + tecla Delete** — Al hacer clic sobre una entidad (con cualquier herramienta activa excepto erase), la entidad queda seleccionada (resaltada con un anillo cyan). Presionando `Delete` o `Backspace` se elimina la entidad seleccionada.

3. **Indicador visual** — La entidad seleccionada muestra un borde y ring de color cyan (`ring-2 ring-cyan-400/50`).

### Archivos modificados

- `stores/selectionStore.ts` — Se añadió `selectedEntityId: string | null` y su setter `setSelectedEntityId`.
- `components/editor/LevelCanvas.tsx` — Se integró `removeEntity`, lógica de selección al hacer clic, listener de teclado para Delete/Backspace, y el indicador visual en `GridCell`.

### Uso

1. Seleccionar la herramienta "erase" en el ToolPanel y hacer clic sobre una celda con entidad.
2. Hacer clic directamente sobre una entidad y presionar Delete/Backspace.
