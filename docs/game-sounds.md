# Efectos de sonido en el runtime

## [0.13.0] - 2026-06-05

### Added

- Sonidos sintetizados para eventos del juego.
- Archivos WAV generados mediante síntesis programática (Node.js), almacenados en `public/sounds/`.

### Sounds

| Archivo | Evento | Descripción |
|---|---|---|
| `jump.wav` | Salto del jugador | Chirrido ascendente 400→800 Hz, 0.12s |
| `coin.wav` | Recoger moneda | Dos tonos brillantes (1400 Hz + 2100 Hz), 0.15s |
| `hit.wav` | Daño / Game Over | Zumbido descendente 200→80 Hz, 0.25s |
| `goal.wav` | Nivel completado | Arpegio ascendente (Do5, Mi5, Sol5), 0.4s |

### Technical details

- `RuntimeScene.ts` preload: carga 4 WAV con `this.load.audio()`.
- `RuntimeScene.ts` create: inicializa sonidos con `this.sound.add()`.
- Eventos: salto (`UP` con jugador en suelo), moneda (`onCollectCoin`), daño (`onHitSpike`), meta (`onReachGoal`).
