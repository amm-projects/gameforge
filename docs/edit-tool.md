# Herramienta Editar

## [0.22.0] - 2026-06-08

### Added

- Herramienta **Editar** en el panel de herramientas (junto al botón Borrar).
- Permite inspeccionar y modificar propiedades de tiles y entidades del nivel.
- Al activarla, el botón se resalta en ámbar.

### Changed

- Al hacer clic en un tile o entidad con la herramienta activa, el elemento se resalta con borde ámbar.
- En el panel Inspector aparecen las propiedades del elemento seleccionado.

### Properties

- **Name**: nombre del elemento (solo lectura). Ej: "Suelo", "Jugador", "Puerta"
- **Position**: coordenadas (x, y) en la cuadrícula (solo lectura)
- **Collision**: activar/desactivar colisión física del elemento

### Technical details

- Al desactivar la colisión de un tile, este se vuelve decorativo.
- En entidades, la propiedad se guarda pero el comportamiento en runtime depende del tipo.
- Al hacer clic en otra herramienta (Borrar, tile, entidad) el modo edición se desactiva.
