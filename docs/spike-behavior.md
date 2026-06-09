# Spike Behavior

## [0.23.0] - 2026-06-08

### Changed

- Spikes (`spike-up`, `spike-down`, `spike-left`, `spike-right`) kill the player **instantly** on contact with the tile, regardless of the side.
- Removed the "safe side" (flat base of the spike) that allowed touching without dying.

### Technical details

- In `RuntimeScene.ts`, the `player vs spikeLayer` collision used a `processCallback` that checked the sprite angle. The callback is now `undefined` (no filter), so every collision triggers `onHitSpike()`.
