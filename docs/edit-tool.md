# Herramienta Editar

## Añadido: v0.22.0 (2026-06-08)

## ¿Cómo funciona?

La herramienta **Editar** permite inspeccionar y modificar propiedades de los elementos del nivel (tiles y entidades).

### Activar

1. Haz clic en el botón **Editar** del panel de herramientas (junto al botón Borrar).
2. El botón se queda resaltado en ámbar mientras está activo.
3. Al hacer clic en otro botón (Borrar, un tile o una entidad), el modo edición se desactiva.

### Seleccionar un elemento

Con la herramienta Editar activa, haz clic sobre cualquier tile o entidad en el canvas. El elemento se resalta con un borde ámbar y en el panel **Inspector** aparecen sus propiedades.

### Propiedades

Para todos los elementos se muestran:

| Propiedad | Descripción |
|---|---|
| **Name** | Nombre del elemento (solo lectura). Ej: "Suelo", "Jugador", "Puerta" |
| **Position** | Coordenadas (x, y) en la cuadrícula (solo lectura) |
| **Collision** | Si el elemento tiene colisión física. Se puede activar o desactivar con el botón ON/OFF |

### Colisión

Al desactivar la colisión de un tile, este se vuelve decorativo: el jugador y los enemigos lo atraviesan. Al desactivarla en una entidad, se guarda la propiedad pero el comportamiento en el runtime depende del tipo de entidad.

### Cerrar

Haz clic en el botón **Close** dentro del inspector de elementos, o selecciona otra herramienta.
