# Void Death

## 2026-06-03

### Added

- Muerte al caer al vacío en el runtime de Phaser (`GameRuntime.tsx`).

### Technical details

- Se eliminó `player.setCollideWorldBounds(true)` para que el jugador pueda caer fuera del mundo.
- En `update()`, se verifica `player.y > worldHeight + 64`. Si es cierto, se llama a `onHitSpike()` que muestra "Game Over" y pausa la escena.
- El offset de 64px (2 tiles) permite que el jugador desaparezca completamente antes de activar la muerte, dando una sensación natural.
- Se añadió `declare worldHeight: number` a la clase `RuntimeScene` para tener disponible la altura del nivel en `update()`.
