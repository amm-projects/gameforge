# Enemy Patrol

## 2026-06-03

### Added

- Enemy patrol behaviour in the game runtime (`GameRuntime.tsx`).
- Enemies move horizontally (initial velocity `80px/s` to the right) and reverse direction only when colliding with a solid tile or world boundary.

### Technical details

- The enemy's `update()` loop checks `body.blocked.left` / `body.blocked.right` each frame (set by Phaser's arcade physics separation). When either is `true`, the horizontal velocity is set to the opposite direction at a fixed speed of `80px/s`.
- `body.setBounce(1, 0)` was intentionally **not** used. Using bounce caused the physics engine to auto-reverse velocity on collision, which conflicted with the manual `blocked` check (double reversal → jittering / stuck enemies).
- `collideWorldBounds: true` is set on each enemy body to prevent falling off the world; world-bound collisions also set `body.blocked` and trigger the manual reversal.
- Enemy movement logic runs before the `if (!this.player) return` guard in `update()`, so enemies patrol even when no player entity is placed in the level.
- There is no patrol timer. Enemies reverse direction **exclusively** when their body reports a blocked side. This avoids the timer interfering with wall-collision detection.

### Changed

- Group-level `bounceX: 1` was removed from `enemyLayer` config.
- Individual `body.setBounce(1, 0)` was removed from enemy creation.
- Removed the 2-second patrol timer fallback. Enemies no longer reverse direction periodically; they only reverse on tile / world-bound collision.
