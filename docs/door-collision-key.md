# Puerta y Llave

## [0.19.0] - 2026-06-08

### Added

- Sistema de puerta y llave en el runtime.
- La puerta es un obstáculo físico: el jugador no puede atravesarla sin la llave.
- Los enemigos rebotan contra la puerta igual que contra las paredes.
- La llave se recoge al instante al tocarla, mostrando un icono en pantalla.
- Mensajes "Need a key!" y "Door opened!" según el estado.
- El nivel no termina al abrir la puerta; el jugador debe llegar a la meta.

## [0.22.0] - 2026-06-08

### Changed

- Colisión de puerta configurable desde la herramienta Editar.
- Se puede activar/desactivar la colisión de cualquier tile, incluyendo puertas.
- Si la colisión está desactivada, la puerta es decorativa y el jugador la atraviesa aunque no tenga llave.
