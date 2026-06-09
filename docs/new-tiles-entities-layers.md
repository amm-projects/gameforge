# New Tiles, Entities, and Layer System

## [0.17.0] - 2026-06-05

### Added

#### Tiles

- **Brick** (`brick`): solid tile with full collision, sprite `public/sprites/brick.svg`.
- **Platform** (`platform`): solid tile, sprite `public/sprites/platform.svg`. Usage: floating platforms.

#### Entities

- **Checkpoint** (`checkpoint`): saves player position on overlap. Respawn on death.
- **Door** (`door`): solid obstacle. Blocks the player until they have the key. Migrated from `overlap` to `collider` in v0.19.0.
- **Key** (`key`): on pickup sets `hasKey = true`, shows icon in UI, self-destructs.

#### Layer System

- 6-layer system (0-5) for organizing tiles in the editor.
- `layerStore.ts`: Zustand store with `activeLayer` and `visibleLayers` (Set).
- Each `Tile` can have optional `layer: Layer` property (0-5). Default: layer 2 (SOLID).
- 6-button bar in the canvas header.
- Click: toggle visibility. Double-click: set active layer.
- Runtime ignores layers — all solid tiles are treated equally.

### Changed

- `Tile` interface: added optional `layer` property.

## [0.19.0] - 2026-06-08

### Changed

- Door migrated from `overlap` to `collider` for real physical obstacle.
- Door opening no longer triggers victory.

## [0.16.0] - 2026-06-05

### Added

- **Entity Property Editor** in InspectorPanel.
- "Entities" section lists all entities in the level.
- Clicking an entity selects it and shows `properties: Record<string, unknown>`.
- Each property as an editable text field.
- "+" button to add key/value properties.
- Selected entity is highlighted on canvas.
- `updateEntityProperty(id, key, value)` in editorStore.
