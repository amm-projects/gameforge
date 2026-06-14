# Runtime Responsive Canvas

## [0.56.2] - 2026-06-14

### Changed

- **Scale mode**: Switched from `Phaser.Scale.NONE` to `Phaser.Scale.FIT` in `GameRuntime.tsx:57`. The canvas now scales to fit the parent container while preserving the 16:9 aspect ratio, instead of using fixed pixel dimensions.

- **Container sizing**: Replaced the fixed `height: canvasHeight` inline style on the container `<div>` with `aspectRatio: "1280 / 720"` (`GameRuntime.tsx:140`). The container fills 100% of its parent width and computes height from the aspect ratio.

- **Removed level-derived dimensions**: Eliminated `canvasWidth` and `canvasHeight` constants that were computed from `Math.min(level.width * 32, 1280)` / `Math.min(level.height * 32, 720)`. The game now uses a fixed base resolution of 1280×720, independent of level size.

### Motivation

The runtime canvas was locked to a static size (`Math.min(level.width * 32, 1280)` × `Math.min(level.height * 32, 720)`), causing it to overflow or leave unused space on different viewports. This change ensures the canvas adapts to any screen size — desktop, tablet, or mobile — while maintaining a consistent aspect ratio.
