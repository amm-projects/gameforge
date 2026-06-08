# Puerta y Llave

## Añadido: v0.19.0 (2026-06-08)
## Actualizado: v0.22.0 (colisión configurable por elemento)

## ¿Cómo funciona?

La puerta es un obstáculo físico. El jugador no puede atravesarla a menos que tenga la llave. Los enemigos tampoco pueden atravesarla: rebotan contra ella igual que contra las paredes.

### Sin llave

- El jugador choca contra la puerta y no puede pasar.
- Aparece el mensaje "Need a key!".

### Con llave

- El jugador toca la puerta y esta se abre (desaparece).
- Aparece el mensaje "Door opened!".
- El nivel **no termina** al abrir la puerta. El jugador debe seguir hasta la meta para ganar.

### Colisión configurable

Desde la herramienta **Editar** se puede activar o desactivar la colisión de cualquier tile, incluidas las puertas. Si se desactiva, la puerta se vuelve decorativa y el jugador puede atravesarla incluso sin llave.

### ¿Cómo se consigue la llave?

El jugador solo tiene que tocarla. La llave se recoge al instante y aparece un icono en la pantalla indicando que ya la tienes.
