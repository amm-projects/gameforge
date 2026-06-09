# New Tiles, Entities, and Layer System

## [0.17.0] - 2026-06-05

### Added

#### Tiles

- **Brick** (`brick`): tile sólido con colisión completa, sprite `public/sprites/brick.svg`.
- **Platform** (`platform`): tile sólido, sprite `public/sprites/platform.svg`. Uso: plataformas flotantes.

#### Entities

- **Checkpoint** (`checkpoint`): guarda posición del jugador al superponerse. Reaparición en muerte.
- **Door** (`door`): obstáculo sólido. Bloquea al jugador hasta tener llave. Migrado de `overlap` a `collider` en v0.19.0.
- **Key** (`key`): al recogerla establece `hasKey = true`, muestra icono en UI, se destruye.

#### Layer System

- Sistema de 6 capas (0-5) para organizar tiles en el editor.
- `layerStore.ts`: store Zustand con `activeLayer` y `visibleLayers` (Set).
- Cada `Tile` puede tener propiedad opcional `layer: Layer` (0-5). Default: capa 2 (SOLID).
- Barra de 6 botones en el header del canvas.
- Clic: toggle visibilidad. Doble clic: capa activa.
- El runtime ignora capas — todos los tiles sólidos se tratan igual.

### Changed

- `Tile` interface: añadida propiedad opcional `layer`.

## [0.19.0] - 2026-06-08

### Changed

- Door migrada de `overlap` a `collider` para obstáculo físico real.
- La apertura de puerta ya no dispara victoria.

## [0.16.0] - 2026-06-05

### Added

- **Entity Property Editor** en InspectorPanel.
- Sección "Entities" lista todas las entidades del nivel.
- Clic en entidad la selecciona y muestra `properties: Record<string, unknown>`.
- Cada propiedad como campo de texto editable.
- Botón "+" para agregar propiedades clave/valor.
- Entidad seleccionada se resalta en canvas.
- `updateEntityProperty(id, key, value)` en editorStore.
