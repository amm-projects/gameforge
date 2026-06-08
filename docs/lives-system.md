# Vidas del Jugador

## Añadido: v0.20.0 (2026-06-08)
## Actualizado: v0.21.0 (pantalla Game Over con botones)

## ¿Cómo funciona?

El jugador empieza con **3 vidas**. Cada vez que muere pierde una vida y vuelve a aparecer en el nivel.

### ¿Cuándo pierde una vida?

- Si toca un pincho.
- Si un enemigo lo toca.
- Si se cae al vacío.

### ¿Dónde reaparece?

- Si activó un **checkpoint** antes de morir, vuelve a ese punto.
- Si no activó ningún checkpoint, vuelve al principio del nivel (donde empezó).

### ¿Qué pasa cuando se quedan sin vidas?

Cuando el jugador pierde la tercera vida aparece una pantalla **"GAME OVER"** con fondo oscuro y dos botones:

- **Retry** — reinicia el nivel desde el principio (vidas, monedas y llave se reinician).
- **Stop** — cierra el runtime y vuelve al editor.

El juego se detiene por completo (enemigos, gravedad y colisiones se pausan) mientras la pantalla está visible.

### Indicador en pantalla

En la esquina superior izquierda se ve un contador de vidas con un corazón: ♥ x 3, ♥ x 2, ♥ x 1.
