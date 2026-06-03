# ToolPanel Visual Redesign

## 2026-06-03

### Changed

- `ToolPanel.tsx`: reemplazados los botones de texto plano por filas visuales con preview coloreado (32x32px), nombre en español, tipo técnico y botón de arrastre con miniatura.

### Visual details

| Elemento | Color      | Símbolo |
|----------|------------|---------|
| Suelo    | amber-700  | —       |
| Pinchos  | rose-600   | `^`     |
| Jugador  | blue-500   | `P`     |
| Moneda   | yellow-400 | `C`     |
| Enemigo  | red-600    | `E`     |
| Meta     | green-500  | `G`     |

### Technical details

- Los colores coinciden con los usados en `LevelCanvas.tsx` (editor) y `GameRuntime.tsx` (runtime) para mantener consistencia visual.
- Se define `TILE_VISUAL` y `ENTITY_VISUAL` con `bg`, `symbol` y `label` para cada tipo.
- Componente `Preview`: cuadrado de 8x8 (2rem) con color de fondo y contenido centrado.
- `DraggableItem` ahora recibe un `visual` prop (ReactNode) en lugar de texto plano, mostrando el mismo preview en miniatura.
- El layout cambió de `grid gap-2` a `flex flex-col gap-2` con botones que ocupan todo el ancho disponible.
