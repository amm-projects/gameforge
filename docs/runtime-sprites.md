# Sprites en el runtime de Phaser

## [0.12.0] - 2026-06-05

### Changed

- Reemplazados rectángulos de color sólido por sprites dibujados programáticamente con Phaser Graphics.
- Cada sprite se dibuja con `fillRect`, `fillCircle`, `fillTriangle` y `lineStyle`, convertido a textura con `generateTexture()`.

### Sprites

| Elemento | Tamaño | Descripción |
|---|---|---|
| Ground | 32×32 | Ladrillos marrones con variación de tono |
| Spike | 32×32 | Triángulo rojo |
| Player | 32×32 | Cabeza circular + cuerpo + piernas, azul, ojos blancos |
| Coin | 32×32 | Círculo dorado con centro más claro |
| Enemy | 32×32 | Círculo naranja con ojos blancos y pupilas negras |
| Goal | 32×32 | Poste verde con banderín |

### Technical details

- Eliminado bucle genérico `textures.forEach()` e interfaz `RuntimeTexture`.
- Añadido método auxiliar `createTexture(key, width, height, draw)` con callback de dibujo.
- Sprites SVG en `public/sprites/` mantienen coherencia visual con sprites del runtime.
