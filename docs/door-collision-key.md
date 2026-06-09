# Door and Key

## [0.19.0] - 2026-06-08

### Added

- Door and key system in the runtime.
- The door is a physical obstacle: the player cannot pass through without the key.
- Enemies bounce off the door the same as walls.
- The key is collected instantly on touch, showing an icon on screen.
- "Need a key!" and "Door opened!" messages according to state.
- The level does not end when the door opens; the player must reach the goal.

## [0.22.0] - 2026-06-08

### Changed

- Door collision configurable from the Edit tool.
- Collision can be toggled on/off for any tile, including doors.
- If collision is off, the door is decorative and the player walks through it even without the key.
