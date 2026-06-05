# New Tiles, Entities, and Layer System

## Added: v0.17.0 (2026-06-05)

## Tiles

### Brick
- **Type**: `brick`
- **Category**: Sólido
- **Sprite**: `public/sprites/brick.svg`
- **Runtime texture**: `runtime-brick` (generada proceduralmente con Phaser Graphics)
- **Comportamiento**: idéntico a `ground` — tile sólido con colisión completa.
- **Uso**: muros, plataformas destructibles (futuro).

### Platform
- **Type**: `platform`
- **Category**: Sólido
- **Sprite**: `public/sprites/platform.svg`
- **Runtime texture**: `runtime-platform`
- **Comportamiento**: tile sólido (física completa por ahora; en el futuro se puede cambiar a one-way platform, que solo colisiona desde arriba).
- **Uso**: plataformas flotantes, suelos intermedios.

## Entities

### Checkpoint
- **Type**: `checkpoint`
- **Sprite**: `public/sprites/checkpoint.svg`
- **Runtime texture**: `runtime-checkpoint`
- **Comportamiento**: al superponerse con el jugador, guarda la posición actual del jugador (`player.setData("checkpointX/Y")`). Si el jugador muere (pinchos, caída), reaparece en esa posición. Si no hay checkpoint, muestra "Game Over" y pausa el juego.
- **Runtime layer**: `checkpointLayer` (StaticGroup)
- **Propiedades**: ninguna por defecto.

### Door
- **Type**: `door`
- **Sprite**: `public/sprites/door.svg`
- **Runtime texture**: `runtime-door`
- **Comportamiento**: al superponerse con el jugador:
  - Si `hasKey = true`: reproduce sonido de goal, muestra "Door opened!" y pausa el nivel (victoria).
  - Si `hasKey = false`: muestra "Need a key!".
- **Runtime layer**: `doorLayer` (StaticGroup)

### Key
- **Type**: `key`
- **Sprite**: `public/sprites/key.svg`
- **Runtime texture**: `runtime-key`
- **Comportamiento**: al superponerse con el jugador:
  - Establece `hasKey = true` en la escena.
  - Muestra el icono de llave en la UI del runtime.
  - Se destruye a sí misma (como las monedas).
  - Reproduce sonido de moneda.
- **Runtime layer**: `keyLayer` (StaticGroup)
- **Propiedades útiles (futuro)**: `targetDoorId` para vincular a una puerta específica.

## Layer System

### Arquitectura

Se introdujo un sistema de 6 capas para organizar los tiles visualmente en el editor:

| Capa | Constante | Nombre | Uso típico |
|---|---|---|---|
| 0 | `LAYERS.BACKGROUND` | Fondo | Cielo, montañas lejanas |
| 1 | `LAYERS.DECORATION` | Decoración | Arbustos, nubes, rocas decorativas |
| 2 | `LAYERS.SOLID` | Tiles sólidos | Ground, Brick, Platform, Spikes (valor por defecto) |
| 3 | `LAYERS.ENEMIES` | Enemigos | (reservado para entidades en capa) |
| 4 | `LAYERS.OBJECTS` | Objetos | (reservado) |
| 5 | `LAYERS.PLAYER` | Jugador | (reservado) |

### Almacenamiento

- `layerStore.ts`: store Zustand separado con `activeLayer` (la capa activa para pintar) y `visibleLayers` (Set de capas visibles).
- Cada `Tile` en el nivel puede tener una propiedad opcional `layer: Layer` (0-5). Si no se especifica, se asume capa 2 (SOLID).

### UI

- Barra de 6 botones numerados (0-5) en el header del canvas del editor.
- **Clic simple**: toggle visibilidad de la capa (tachada si oculta).
- **Doble clic**: establece la capa como activa (resaltada en ámbar).
- El tileMap del canvas filtra los tiles por `visibleLayers` antes de renderizar.
- Al pintar un tile, se le asigna `activeLayer`.

### Runtime

El runtime **ignora** el sistema de capas por ahora — todos los tiles sólidos se tratan igual independientemente de su capa.

## Entity Property Editor

### InspectorPanel

- Sección "Entities" que lista todas las entidades del nivel.
- Clic en una entidad la selecciona y muestra sus propiedades (`properties: Record<string, unknown>`).
- Cada propiedad se muestra como campo de texto editable.
- Botón "+" para agregar nuevas propiedades clave/valor.
- La entidad seleccionada se resalta en el canvas del editor.

### Editor Store

- Nueva función `updateEntityProperty(id, key, value)` que actualiza una propiedad de una entidad por ID.
- Utiliza spread inmutable: `{ ...entity, properties: { ...entity.properties, [key]: value } }`.
