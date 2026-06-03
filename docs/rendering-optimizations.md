# Rendering Optimizations

## 2026-06-03

### Context

El editor de niveles con grid 64×64 (4096 celdas) tenía problemas de rendimiento al colocar elementos y al hacer drag & drop desde el panel de herramientas.

### Problemas identificados

1. **4096 nodos DOM** — Cada celda se renderizaba como un `<button>` independiente, incluso las vacías.
2. **4096 `useDroppable` hooks** — Cada celda se registraba como droppable en dnd-kit, provocando notificaciones masivas en el contexto de arrastre.
3. **Actualizaciones individuales** — Cada celda pintada durante un drag disparaba una actualización separada del store de Zustand, causando re-render completo del canvas.
4. **Sin React.memo** — Todas las celdas se re-renderizaban al cambiar cualquier estado.

### Soluciones implementadas

#### 1. Virtual DOM grid (renderizado condicional)

Solo se crean nodos DOM para celdas que contienen tiles, entidades o la entidad seleccionada. Las celdas vacías se representan mediante un fondo CSS:

```css
background-image:
  linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px),
  linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px);
background-size: 10px 10px;
```

Las celdas ocupadas se posicionan con `position: absolute` usando `left` y `top` calculados desde sus coordenadas.

**Impacto**: ~99% menos nodos DOM en un nivel vacío (de 4096 a ~0).

#### 2. Droppable único

Se eliminó `useDroppable` de cada `GridCell` y se reemplazó por un único droppable en el contenedor del grid. El cálculo de la celda objetivo en `EditorShell.handleDragEnd` se hace mediante:

```ts
const dropX = activatorEvent.clientX + delta.x;
const dropY = activatorEvent.clientY + delta.y;
const rect = gridEl.getBoundingClientRect();
const x = Math.floor((dropX - rect.left) / CELL_SIZE);
const y = Math.floor((dropY - rect.top) / CELL_SIZE);
```

#### 3. Batch painting

Se agregó `batchPaint` al `editorStore` que aplica múltiples acciones en una sola actualización de estado. Durante el pintado por arrastre, las acciones se acumulan en un array y se flushean via `requestAnimationFrame`.

#### 4. React.memo + selectores granulares

- `GridCell` envuelto en `React.memo` para evitar re-renders innecesarios.
- Cada propiedad del store se subscribe individualmente en lugar de usar el store completo.

### Archivos modificados

- `stores/editorStore.ts` — Nuevo `batchPaint`, exportado `PaintAction`
- `components/editor/LevelCanvas.tsx` — Grid virtual, droppable único, batching, memo, selectores granulares
- `components/EditorShell.tsx` — Cálculo de celda por coordenadas
