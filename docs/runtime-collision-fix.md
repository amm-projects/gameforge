# Runtime Collision Fix

## [0.2.2] - 2026-06-03

### Fixed

- Fixed Arcade Physics body alignment by replacing the scaled 1px runtime texture with generated textures at real collision sizes.
- Fixed the player body setup so the body is centered and sized from explicit runtime constants.

### Changed

- Runtime objects now use dedicated generated textures for ground, spikes, player, coins, goal, and enemies.

### Removed

- Removed dependency on `setDisplaySize` for runtime physics object sizing.

### Security

- No security changes.

## [0.2.1] - 2026-06-03

### Fixed

- Fixed player collisions with ground tiles in the Phaser runtime.
- Ground and spike tiles are now created directly from Arcade Physics static groups.
- Static tile, coin, and goal bodies are refreshed after display size changes so collision bounds match their rendered size.

### Changed

- Runtime Phaser typing was tightened for the dynamic import and overlap callbacks.

### Added

- Documentation for the runtime collision fix.

### Removed

- No runtime data fields were removed.

### Security

- No security changes.
