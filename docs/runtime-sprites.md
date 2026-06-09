# Sprites in the Phaser Runtime

## [0.12.0] - 2026-06-05

### Changed

- Replaced solid color rectangles with programmatically drawn sprites using Phaser Graphics.
- Each sprite is drawn with `fillRect`, `fillCircle`, `fillTriangle` and `lineStyle`, then converted to a texture with `generateTexture()`.

### Sprites

| Element | Size | Description |
|---|---|---|
| Ground | 32×32 | Brown bricks with tone variation |
| Spike | 32×32 | Red triangle |
| Player | 32×32 | Circular head + body + legs, blue, white eyes |
| Coin | 32×32 | Golden circle with lighter center |
| Enemy | 32×32 | Orange circle with white eyes and black pupils |
| Goal | 32×32 | Green pole with flag |

### Technical details

- Removed generic `textures.forEach()` loop and `RuntimeTexture` interface.
- Added helper method `createTexture(key, width, height, draw)` with drawing callback.
- SVG sprites in `public/sprites/` maintain visual consistency with runtime sprites.
