# Sound effects in the runtime

## [0.13.0] - 2026-06-05

### Added

- Synthesized sounds for game events.
- WAV files generated via programmatic synthesis (Node.js), stored in `public/sounds/`.

### Sounds

| File | Event | Description |
|---|---|---|
| `jump.wav` | Player jump | Ascending chirp 400→800 Hz, 0.12s |
| `coin.wav` | Collect coin | Two bright tones (1400 Hz + 2100 Hz), 0.15s |
| `hit.wav` | Damage / Game Over | Descending buzz 200→80 Hz, 0.25s |
| `goal.wav` | Level completed | Ascending arpeggio (C5, E5, G5), 0.4s |

### Technical details

- `RuntimeScene.ts` preload: loads 4 WAVs with `this.load.audio()`.
- `RuntimeScene.ts` create: initializes sounds with `this.sound.add()`.
- Events: jump (`UP` with player on ground), coin (`onCollectCoin`), damage (`onHitSpike`), goal (`onReachGoal`).
