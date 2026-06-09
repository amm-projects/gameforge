# ToolPanel Visual Redesign

## [0.5.0] - 2026-06-03

### Changed

- `ToolPanel.tsx`: reemplazados botones de texto plano por filas visuales con preview coloreado (32×32px), nombre en español, tipo técnico.

### Visual

| Elemento | Color | Símbolo |
|---|---|---|
| Suelo | amber-700 | — |
| Pinchos | rose-600 | `^` |
| Jugador | blue-500 | `P` |
| Moneda | yellow-400 | `C` |
| Enemigo | red-600 | `E` |
| Meta | green-500 | `G` |

### Technical details

- Colores coinciden con `LevelCanvas.tsx` y `RuntimeScene.ts` para consistencia visual.
- `TILE_VISUAL` y `ENTITY_VISUAL` con `bg`, `symbol` y `label` para cada tipo.
- Layout: `flex flex-col gap-2` con botones de ancho completo.
