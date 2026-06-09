# Vidas del Jugador

## [0.20.0] - 2026-06-08

### Added

- Sistema de vidas: el jugador empieza con 3 vidas.
- Al morir (pincho, enemigo, caída al vacío) pierde una vida y reaparece.
- Si activó un **checkpoint** antes de morir, reaparece en ese punto.
- Si no hay checkpoint, reaparece al inicio del nivel.
- Indicador en pantalla: ♥ x 3, ♥ x 2, ♥ x 1.

## [0.21.0] - 2026-06-08

### Added

- Pantalla **"GAME OVER"** al perder todas las vidas.
- Botón **Retry**: reinicia nivel (vidas, monedas y llave se reinician).
- Botón **Stop**: cierra runtime y vuelve al editor.
- El juego se pausa (enemigos, gravedad y colisiones) mientras la pantalla está visible.
