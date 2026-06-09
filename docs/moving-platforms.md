# Moving Platforms

## [0.18.0] - 2026-06-06

### Added

- Platforms (`platform` type) can be configured to move automatically in the runtime.
- Vertical (`Up-Down`) or horizontal (`Left-Right`) movement.
- Configurable speed (default 100 px/s).
- Configurable range (default 96 px, ~3 cells).
- The player can stand on the platform and is carried along.
- Moving platforms collide with player and enemies.

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `moveAxis` | `"none"` \| `"vertical"` \| `"horizontal"` | `"none"` | Movement direction |
| `moveSpeed` | `number` | `100` | Speed px/s |
| `moveRange` | `number` | `96` | Maximum distance before reversing (px) |

### Technical details

- The platform moves from its initial position, and when it reaches the range it reverses direction.
- Properties are stored in `tile.properties` within the level JSON.
