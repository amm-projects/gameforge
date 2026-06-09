# Void Death

## [0.14.0] - 2026-06-03

### Added

- Void fall death in the runtime (`RuntimeScene.ts`).
- Removed `player.setCollideWorldBounds(true)` to allow falling out of the world.
- In `update()`, checks `player.y > worldHeight + 64`. If true, calls `onHitSpike()`.

### Technical details

- 64px (2 tiles) offset so the player disappears before death triggers.
- Added `declare worldHeight: number` to `RuntimeScene` to make level height available in `update()`.
