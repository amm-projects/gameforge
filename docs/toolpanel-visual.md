# ToolPanel Visual Redesign

## [0.5.0] - 2026-06-03

### Changed

- `ToolPanel.tsx`: replaced plain text buttons with visual rows featuring colored preview (32×32px), Spanish name, and technical type.

### Visual

| Element | Color | Symbol |
|---|---|---|
| Ground | amber-700 | — |
| Spikes | rose-600 | `^` |
| Player | blue-500 | `P` |
| Coin | yellow-400 | `C` |
| Enemy | red-600 | `E` |
| Goal | green-500 | `G` |

### Technical details

- Colors match `LevelCanvas.tsx` and `RuntimeScene.ts` for visual consistency.
- `TILE_VISUAL` and `ENTITY_VISUAL` with `bg`, `symbol` and `label` for each type.
- Layout: `flex flex-col gap-2` with full-width buttons.
