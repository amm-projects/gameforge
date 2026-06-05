# Efectos de sonido en el runtime

**Fecha:** 2026-06-05  
**Versión:** 0.13.0  
**Decisión técnica:** Añadir sonidos sintetizados al juego.

## Sonidos

Los archivos WAV se generan mediante síntesis programática (Node.js) y se almacenan en `public/sounds/`.

| Archivo | Evento | Descripción |
|---|---|---|
| `jump.wav` | Salto del jugador | Chirrido ascendente 400→800 Hz, 0.12s |
| `coin.wav` | Recoger moneda | Dos tonos brillantes (1400 Hz + 2100 Hz), 0.15s |
| `hit.wav` | Daño / Game Over | Zumbido descendente 200→80 Hz, 0.25s |
| `goal.wav` | Nivel completado | Arpegio ascendente (Do5, Mi5, Sol5), 0.4s |

## Implementación

En `GameRuntime.tsx`:

1. **preload()**: carga los 4 archivos WAV con `this.load.audio()`.
2. **create()**: inicializa los sonidos con `this.sound.add()`.
3. **Eventos**:
   - Salto: `this.soundJump.play()` al presionar UP con el jugador en el suelo.
   - Moneda: `this.soundCoin.play()` en `onCollectCoin()`.
   - Daño: `this.soundHit.play()` en `onHitSpike()`.
   - Meta: `this.soundGoal.play()` en `onReachGoal()`.

## Archivos

- `components/runtime/GameRuntime.tsx`
- `public/sounds/` (4 WAV)
