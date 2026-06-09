# Enemy Patrol

## [0.2.0] - 2026-06-03

### Added

- Enemy patrol behaviour in the game runtime (`RuntimeScene.ts`).
- Enemies move horizontally (initial velocity `80px/s` to the right) and reverse direction only when colliding with a solid tile or world boundary.
- Enemy movement logic runs before the `if (!this.player) return` guard, so enemies patrol even without a player entity.

### Technical details

- The enemy's `update()` loop checks `body.blocked.left` / `body.blocked.right` each frame. When either is `true`, horizontal velocity is set to the opposite direction at a fixed speed of `80px/s`.
- `body.setBounce(1, 0)` was intentionally **not** used to avoid physics engine auto-reversal conflicting with manual `blocked` checks.
- `collideWorldBounds: true` is set on each enemy body to prevent falling off the world.
- No patrol timer exists. Enemies reverse direction **exclusively** on collision.

### Changed

- Group-level `bounceX: 1` removed from `enemyLayer` config.
- Individual `body.setBounce(1, 0)` removed from enemy creation.
- Removed the 2-second patrol timer fallback.
