# Music system

## Overview

Background music is pre-generated as WAV files by `scripts/generate-music.mjs` and served from `public/sounds/music/`. Each level theme has its own WAV that loops seamlessly in Phaser.

### Files

| Theme | File | Tempo | Duration | Style |
|---|---|---|---|---|
| Calm | `calm.wav` | ~80 BPM | 12.78s | Soft pad chords + gentle arpeggio |
| Adventure | `adventure.wav` | ~120 BPM | 8.49s | Fanfare chords + heroic melody |
| Retro | `retro.wav` | ~200 BPM | 5.17s | Chiptune squares + fast arpeggio |
| Mystery | `mystery.wav` | ~60 BPM | 17.16s | Dark strings + wind texture |
| Boss | `boss.wav` | ~140 BPM | 7.37s | Power chords + aggressive melody |

## Architecture

### Separation of concerns

Music generation is entirely independent of Phaser and the editor. The script runs as a standalone Node.js process that outputs standard WAV files. No game logic lives in the generator.

### Generation chain

```
Note data (beat, frequency, duration, velocity)
    → sequence() / chordSequence()
    → mix() layers
    → reverb()
    → makeLoopable()
    → writeWav()
```

### Synthesis

All instruments are synthesized from basic waveforms:

| Instrument | Waveform | Harmonics |
|---|---|---|
| `padChord` | Sine | Fundamental + octave (×2) with detune |
| `triLead` | Triangle | Pure triangle |
| `sqrLead` | Square | Pure square (for chiptune) |
| `bassNote` | Sine | Sub (×0.5) + fundamental + octave (×2) |
| `kick` | Sine sweep | 150→40 Hz sweep + noise |
| `snare` | Noise + sine | White noise + 200 Hz sine |
| `stringPad` | Sine | Fundamental + 2.01× + 3.02× harmonics |

### ADSR envelopes

Each voice uses a 4-stage envelope:

| Parameter | Typical values |
|---|---|
| Attack | 0.002s – 0.5s |
| Decay | 0.02s – 0.3s |
| Sustain | 0.1 – 0.8 |
| Release | 0.01s – 0.8s |

### Sequencer

`sequence()` and `chordSequence()` take an array of notes/chords with beat positions and durations, then render them to a Float64Array at the given tempo. `percSequence()` wraps drum hits for the same pipeline.

### Reverb

A simple delay-line reverb with 3 taps (`size`, `size × 1.5`, `size × 2.2`) with decaying gain. Padding is dynamically calculated from the max echo length, not hardcoded.

### Loopability

All themes are exactly 16 beats long. Every layer (chords, melody, bass, percussion) spans the full 16-beat cycle. The last note of each melody is harmonically unresolved, creating tension that resolves when the loop restarts. A `makeLoopable()` function trims any remaining sub-noise-floor samples and applies a 50ms end→beginning crossfade as a safety net.

## Cycle structure (16 beats)

Each theme follows a 4-bar structure (4 × 4 beats):

| Bars | Function |
|---|---|
| 1–4 (beats 0–3) | Establish tonic / chord I |
| 5–8 (beats 4–7) | Move to subdominant or relative |
| 9–12 (beats 8–11) | Explore dominant or mediant |
| 13–16 (beats 12–15) | Unresolved ending → leads back to bar 1 |

### Unresolved endings

| Theme | Key | Last note | Function | Resolves to |
|---|---|---|---|---|
| Calm | C major | D4 | Supertonic (9th of Cmaj7) | E4 (beat 0) |
| Adventure | C major | B3 | Leading tone | C4 (beat 0) |
| Retro | C major | B4 | Leading tone | C5 (beat 0) |
| Mystery | C minor | F4 | Subdominant | G4 (beat 0) |
| Boss | C minor | G4 | Dominant | C4 (beat 0) |

## Harmonic progressions

### Calm (C major)

| Beat | Chord | Notes |
|---|---|---|
| 0 | Cmaj7 | C, E, G, B |
| 4 | Am7 | A, C, E, G |
| 8 | Fmaj7 | F, A, C, E |
| 12 | Gsus4 | G, C, D, F → resolves to Cmaj7 |

### Adventure (C major)

| Beat | Chord | Notes |
|---|---|---|
| 0 | C | C, E, G, C |
| 4 | G | G, B, D, G |
| 8 | Am | A, C, E, A |
| 12 | F/C | F, G, C, E → resolves to C |

### Retro (C major)

| Beat | Chord | Notes |
|---|---|---|
| 0 | C | C, E, G |
| 4 | C | C, E, G |
| 8 | F | F, A, C |
| 12 | G | G, B, D → resolves to C |

### Mystery (Dm → Cm)

| Beat | Chord | Notes |
|---|---|---|
| 0 | Dm9 | D, F, A, C, E |
| 5.5 | G13sus4 | G, C, D, F |
| 8 | Cm9 | C, Eb, G, Bb, D → resolves to Dm9 |

### Boss (C minor)

| Beat | Chord | Notes |
|---|---|---|
| 0 | C5 | C, G, C |
| 3 | C5 | C, G, C |
| 6 | Eb5 | Eb, Bb, Eb |
| 9 | Eb5 | Eb, Bb, Eb |
| 12 | F5 | F, C, F |
| 15 | G5 | G, D, G → resolves to C5 |

## Percussion patterns

### Adventure

Kick on beats 0, 2, 4, 6, 8, 10, 12, 13, 14, 15, 16 (cycle fill).

### Retro

- Kick: every beat (0–16), alternating velocity (downbeat 0.8, offbeat 0.4)
- Snare: offbeats 1, 3, 5, 7, 9, 11, 13, 15, 17 (cycle fill)

### Boss

- Kick: every beat 0–16, alternating velocity (downbeat 0.95, offbeat 0.5)
- Snare: offbeats 1, 3, 5, 7, 9, 11, 13, 15, 17 (cycle fill)

Calm has no percussion. Mystery has no percussion (uses wind texture instead).

## JSON level format integration

Levels reference a music theme via the `music` field in the level JSON:

```json
{
  "music": "calm",
  "tiles": [...],
  "entities": [...]
}
```

Phaser loads the corresponding `public/sounds/music/{theme}.wav` file. See `MusicPicker.tsx` for the UI selector and `projectStore.ts` for state management.

## Performance

- WAV files are 440 KB – 1478 KB each (uncompressed, 44100 Hz, 16-bit mono).
- Phaser loads all 5 WAVs into Web Audio API buffers on scene start (async).
- Zero CPU cost during gameplay — audio is decoded once and played by the browser's audio thread.

## Testing

- All WAVs audited for silent zones (threshold < 50 / 32768):
  - calm: 100% non-zero
  - adventure: 100% non-zero
  - retro: 99.9% non-zero
  - mystery: 99.9% non-zero (intentional ambient pauses)
  - boss: 100% non-zero
- Generation is deterministic (no random seeding issues with reverb).

## Regeneration

```bash
node scripts/generate-music.mjs
```

This overwrites all 5 WAVs in `public/sounds/music/`. Run after any change to the script. WAVs must be committed alongside script changes.

## Version history

### [0.40.8] - 2026-06-10

- Last melody notes changed to unresolved pitches (D4, B3, B4, F4, G4) for true continuous-loop effect.
- All themes restructured as exact 16-beat cycles with every layer spanning the full duration.
- `makeLegato()` extended with `cycleLength` parameter for automatic last-note bridging.
- Percussion patterns extended to cycle boundary (beat 16/17).
- `docs/music-system.md` created: comprehensive documentation of the music generation system.

### [0.40.7] - 2026-06-10

### [0.40.6] - 2026-06-10

- `makeLoopable()` function added: trims trailing silence and applies 50ms end→beginning crossfade.
- `reverb()` padding changed from hardcoded 0.5s to dynamic calculation based on max echo length.
- NaN propagation bug fixed: added missing frequencies to `F` pitch map.
- Percussion always-silent bug fixed: added `_f, _dur` parameters to `kick()`/`snare()`.

### [0.40.5] - 2026-06-10

- Mystery theme redesigned with warmer `stringPad` (replaced `etherealPad`).
- Boss power-chord riff synchronized to same tempo as other layers.
- Sequence padding reduced from 1s to 50ms.

### [0.40.2] - 2026-06-10

- All themes: added continuous C2 drone for constant audio.
- `makeLegato()` introduced for seamless note transitions.
- Chord durations extended by 0.5 beats for overlap.

### [0.40.1] - 2026-06-10

- Music system replaced: programmatic synthesis (Web Audio oscillators) → pre-generated WAV files.
- 5 themes with proper chord progressions, mixing, and instrument voices.
- `scripts/generate-music.mjs` created with WAV writer, ADSR envelopes, sequencer, and reverb.
