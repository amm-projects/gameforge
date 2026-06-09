# Plataformas móviles

## [0.18.0] - 2026-06-06

### Added

- Las plataformas (tipo `platform`) pueden configurarse para moverse automáticamente en el runtime.
- Movimiento vertical (`Up-Down`) u horizontal (`Left-Right`).
- Velocidad configurable (por defecto 100 px/s).
- Rango configurable (por defecto 96 px, ~3 celdas).
- El jugador puede pararse sobre la plataforma y es transportado.
- Las plataformas móviles colisionan con jugador y enemigos.

### Properties

| Propiedad | Tipo | Default | Descripción |
|---|---|---|---|
| `moveAxis` | `"none"` \| `"vertical"` \| `"horizontal"` | `"none"` | Dirección del movimiento |
| `moveSpeed` | `number` | `100` | Velocidad px/s |
| `moveRange` | `number` | `96` | Distancia máxima antes de invertir (px) |

### Technical details

- La plataforma se mueve desde su posición inicial, y al alcanzar el rango invierte el sentido.
- Las propiedades se almacenan en `tile.properties` dentro del JSON del nivel.
