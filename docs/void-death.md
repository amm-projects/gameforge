# Void Death

## [0.14.0] - 2026-06-03

### Added

- Muerte al caer al vacío en el runtime (`RuntimeScene.ts`).
- Se eliminó `player.setCollideWorldBounds(true)` para permitir caer fuera del mundo.
- En `update()`, se verifica `player.y > worldHeight + 64`. Si es cierto, se llama a `onHitSpike()`.

### Technical details

- Offset de 64px (2 tiles) para que el jugador desaparezca antes de activar la muerte.
- Añadido `declare worldHeight: number` a `RuntimeScene` para tener altura del nivel disponible en `update()`.
