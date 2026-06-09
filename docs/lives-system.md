# Player Lives

## [0.20.0] - 2026-06-08

### Added

- Lives system: the player starts with 3 lives.
- On death (spike, enemy, void fall) loses one life and respawns.
- If a **checkpoint** was activated before dying, respawns at that point.
- If no checkpoint, respawns at the start of the level.
- On-screen indicator: ♥ x 3, ♥ x 2, ♥ x 1.

## [0.21.0] - 2026-06-08

### Added

- **"GAME OVER"** screen when all lives are lost.
- **Retry** button: restarts the level (lives, coins and key reset).
- **Stop** button: closes runtime and returns to editor.
- The game pauses (enemies, gravity and collisions) while the screen is visible.
