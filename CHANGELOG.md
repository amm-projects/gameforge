# Changelog

All notable changes to this project will be documented in this file.

## [0.57.1] - 2026-06-14
- **Immersive runtime (desktop + tablet + mobile)**

- **Touch controls for mobile/tablet**: New `TouchControls` component with semi-transparent directional buttons (← → on the left side, ↑ jump on the right side) that overlays the canvas when running on touch devices. Buttons dispatch synthetic `keydown`/`keyup` `KeyboardEvent`s matching Phaser's cursor keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`), without interfering with the game canvas below.

## [0.57.0] - 2026-06-14

### Added

- **Immersive runtime (mobile)**: When playing a level, the runtime now enters full-screen mode — canvas fills the viewport, all headers are hidden, and a small exit button (✕ Stop) overlays the canvas. A rotate device overlay is shown instead.

- **Orientation lock**: Attempts `screen.orientation.lock('landscape')` when the runtime starts, with a graceful fallback if unsupported.
- **isImmersive state**: Added `isImmersive`/`setImmersive` to `runtimeStore` so `EditorShell` can hide the header during immersive mode; cleanup ensures header reappears when runtime stops.
- **useDisplayMode hook**: Replaces the old `useOrientation` hook. Returns `{ isPortrait, isImmersive }` by checking for touch capability (`ontouchstart`, `maxTouchPoints`) and comparing viewport dimensions.
- **i18n keys**: Added `runtime.rotateDevice` and `runtime.rotateDescription` in English and Spanish.

### Changed

- **GameRuntime canvas**: Switched from `Phaser.Scale.NONE` to `Phaser.Scale.FIT` with a fixed 1280×720 base resolution, so the canvas always fits the viewport while maintaining 16:9 aspect ratio. Container uses `aspectRatio: "16 / 9"` with `maxHeight: "calc(100vh - 210px)"` to prevent overflow.
- **GameRuntime layout**: Restructured into three render paths — `isImmersive` (full-screen fixed), `isPortrait` (rotate overlay), and normal (desktop section with header bar and canvas).
- **GameRuntime refactoring**: Game instance stored in `gameRef` instead of local variable for proper cleanup and resize handling. Canvas resize forced via `window.dispatchEvent(new Event('resize'))` when orientation changes.
- **EditorShell header**: Conditionally hidden with `hidden` class when `isImmersive` is true.
- **EditorShell layout**: Removed `min-h-[calc(100vh-104px)]`, `min-h-[400px]`, and `min-h-[300px]` constraints. Sidebar widths flexible (`lg:w-[280px] xl:w-[320px]` / `lg:w-[300px] xl:w-[360px]`). Padding scales down on mobile (`p-3 sm:p-4`).
- **ToolPanel grids**: Tile and entity grids use `grid-cols-3 sm:grid-cols-4` to prevent horizontal overflow on narrow screens.
- **SampleLevels grid**: Changed from `grid-cols-2` to `grid-cols-1 sm:grid-cols-2`.
- **LevelCanvas**: Container changed from `overflow-hidden` to `overflow-auto`. Header stacks vertically on mobile (`flex-col gap-2 sm:flex-row`). Text sizes scale with `sm:` breakpoints.
- **InspectorPanel textarea**: Changed from `h-72` to `h-48 sm:h-72`.
- **Runtime header bar**: Buttons and status text use responsive breakpoints; status text uses `truncate` to prevent overflow on small screens.

### Fixed

- **Canvas overflow on small screens**: Removed forced `min-h` constraints and replaced fixed-height canvas with `aspect-ratio` + `max-height` to keep both headers visible.
- **Test failure**: `screen.orientation` guard added to prevent `TypeError` in jsdom when accessing `.lock`.

## [0.56.3] - 2026-06-14

### Changed

- **Full responsive layout**: All panels and elements now adapt to any screen size. The editor layout (EditorShell) uses flexible sidebar widths (`lg:w-[280px] xl:w-[320px]` and `lg:w-[300px] xl:w-[360px]`) instead of fixed widths, collapses to single-column on mobile, and removes forced `min-h` constraints that caused overflow. Header sizes and paddings scale down on mobile via `sm:` breakpoints. The LevelCanvas header stacks vertically on small screens. Padding is reduced across all panels on mobile (`p-3` → `sm:p-4`).

### Fixed

- **Runtime canvas now constrained and always visible**: Replaced the aggressive `flex-1` chain with a proportional layout. The canvas container now uses `aspectRatio: "16 / 9"` with `maxHeight: "calc(100vh - 210px)"`, ensuring it never overflows the viewport. Both headers (GameForge bar + runtime header) are always visible regardless of screen size. The section is capped at `max-w-5xl` to prevent excessive width on large screens.
- **Overflow on small screens**: Removed `min-h-[400px]` and `min-h-[300px]` from flex children and `min-h-[calc(100vh-104px)]` from the main container. Changed LevelCanvas container from `overflow-hidden` to `overflow-auto` so the grid scrolls when the viewport is smaller than the level.
- **ToolPanel/SampleLevels grids**: ToolPanel tile and entity grids changed from `grid-cols-4` to `grid-cols-3 sm:grid-cols-4`. SampleLevels button grid changed from `grid-cols-2` to `grid-cols-1 sm:grid-cols-2`. Both prevent horizontal overflow on narrow viewports.
- **Inspector textarea**: Changed from `h-72` to `h-48 sm:h-72` to use less vertical space on mobile.

## [0.56.2] - 2026-06-14

### Fixed

- **Runtime canvas now responsive**: Changed `Phaser.Scale.NONE` to `Phaser.Scale.FIT` in `GameRuntime.tsx` so the canvas adapts to the viewport width while maintaining 16:9 aspect ratio. Replaced the fixed `{ height: canvasHeight }` container style with `aspectRatio: "1280 / 720"`, making the runtime viewable on all screen sizes.

## [0.56.1] - 2026-06-13

### Fixed

- **Inspector showing wrong entity name**: `EditTargetInspector.tsx` was missing `"1up"`, `"patrol"`, and `"jumper"` from its `ENTITY_LABEL_KEY`, causing the 1UP entity to fall back to `"entity.player"` and display "Player" instead of "1up".

### Changed

- **1UP sprite now a mini player**: both the SVG (`public/sprites/1up.svg`) and runtime texture (`runtime-1up`) redesigned as a smaller version of the player character — red hat, skin face with eyes, blue body, and yellow shoes — centered in the 32×32 tile, replacing the previous heart design.
- **Lives HUD uses player icon**: the heart symbol (♥) in the HUD has been replaced with a scaled-down player character sprite (`runtime-player` frame 0 at 0.5× scale), followed by the life count text. Both icon and text now share `setOrigin(0, 0.5)` for proper vertical centering.

## [0.56.0] - 2026-06-13

### Added

- **Checkpoint sound effect and floating text**: `checkpoint.wav` (bright ascending chime) plays when the player touches a checkpoint for the first time. `showCheckpointText()` creates a sky-blue "Checkpoint!" text above the player that floats up and fades out over 1 second (same pattern as `show1upText()`).
- **One-shot checkpoint activation**: `onReachCheckpoint` now tracks activated checkpoints via `reachedCheckpoints: Set<string>`, so the sound and floating text only fire once per checkpoint (the spawn position is still updated every frame).

### Changed

- **1UP heart sprite aligned with HUD style**: redesigned both the SVG (`public/sprites/1up.svg`) and runtime texture (`runtime-1up`) to match the classic ♥ Unicode shape used in the lives HUD (`♥ x {{count}}`). Uses 8×4px rows for a clean symmetrical silhouette — two 4px bumps at top, gradually widening to 32px at center, tapering to a 4px point at the bottom.

## [0.55.1] - 2026-06-13

### Fixed

- **Door locked sound loop**: `onTryDoor` now checks `soundLocked.isPlaying` before calling `.play()`, preventing the buzzer from restarting every physics frame while colliding with a locked door.

### Changed

- **Improved 1UP heart sprite**: redesigned both the SVG (`public/sprites/1up.svg`) and runtime texture (`runtime-1up`) with a rounder, more recognizable heart shape using smoother pixel-art proportions.

## [0.55.0] - 2026-06-13

### Added

- **Locked door sound** (`locked.wav`): low buzz/click played when trying to open a door without keys.
- **Floating 1UP text**: when the player gains an extra life (from 100 coins or collecting a 1UP entity), a green "1UP" text floats upward above the player and fades out over 1 second.

### Changed

- **1UP sprite redesigned as a heart**: both the SVG (`public/sprites/1up.svg`) and runtime texture (`runtime-1up`) now show a red pixel-art heart instead of a green "1UP" block.
- **RuntimeScene.ts**: added `soundLocked` with loading/init/play. Added `show1upText()` tween animation. Both `onCollectCoin` (100 coins) and `onCollect1up` call `show1upText()`.

## [0.54.0] - 2026-06-13

### Added

- **Key and door sound effects**: new `key.wav` (bright ascending ding) and `door.wav` (deep unlocking sound) played on key collection and door opening respectively.
- **100 coins = 1 extra life**: collecting 100 coins grants an extra life, playing the 1UP sound.
- **1UP entity**: new `1up` entity that can be placed in levels. When collected, grants one extra life. Includes SVG sprite (`public/sprites/1up.svg`), runtime texture (`runtime-1up`), editor support (ToolPanel, GridCell, type definitions, schema, i18n).
- **Extra life sound (`1up.wav`)**: cheerful ascending arpeggio played on 1UP collection and 100-coin milestone.

### Changed

- **RuntimeScene.ts**: added `soundKey`, `soundDoor`, `sound1up` sound objects and loading. Updated `onCollectKey` to play key sound. Updated `onTryDoor` to play door sound and consume a key. Added `onCollect1up` handler. Added 1UP layer, overlap detection, and entity creation. Coins now give 1UP at 100 milestone.
- **Coin sprite made smaller**: both the SVG (`coin.svg`) and runtime texture (`runtime-coin`) now occupy ~24×24 px instead of 32×32 px. Coin hitbox reduced from 18×18 to 14×14.
- **Types**: `EntityType` union now includes `"1up"`. Zod schema updated.
- **SPRITE_PATHS**: added `"1up": "/sprites/1up.svg"`.
- **ToolPanel**: 1UP appears in the entity grid.
- **i18n**: added `entity.1up` translation key.

## [0.53.0] - 2026-06-13

### Added

- **Multiple keys and key consumption**: the key system now supports collecting multiple keys. The HUD shows a key counter instead of a simple on/off icon. Each collected key increments the counter. Each door opened consumes one key from the inventory. This allows level designers to create multi-door puzzles where players must find multiple keys.

### Changed

- **RuntimeScene.ts**: replaced `hasKey: boolean` with `keys: number`. Key HUD shows a persistent icon with a numeric counter. `onCollectKey` increments `keys`. `onTryDoor` checks `keys > 0` and decrements on successful open.
- **i18n.ts**: added `runtimeScene.keys` translation key for the key counter display.

## [0.52.1] - 2026-06-12

### Changed

- **Treasure Tower level improved**

## [0.52.0] - 2026-06-12

### Changed

- **Treasure Tower completely redesigned**: the level now complies with all AGENTS.md level design rules (see AGENTS.md "Level design rules for sample levels"). The tower uses a modular section-and-shaft layout (4 floor sections separated by 3 shafts) where each of the 5 floors has a different combination of missing sections, forcing the player to explore and choose between multiple vertical routes (shafts A, B, C). Key changes:

  - **Maze-like layout**: sections S0(x=1-6), S1(x=11-22), S2(x=27-38), S3(x=43-62) with shafts A(x=7-10), B(x=23-26), C(x=39-42). Each floor has a unique section pattern (e.g., Floor 3 has S1,S2,S3; Floor 4 has S0,S2,S3), forcing the player to navigate through different shafts to progress.
  - **Sky bridges**: horizontal passage platforms added at midY=43 (S1 section, x=11-22) and midY=33 (S2 section, x=27-38), creating alternative routes between shafts at intermediate levels.
  - **Key moved deeper**: relocated from Floor 2 (y=48, S1) to Floor 4 (y=28, S0) — the most remote section on that floor — requiring exploration across 3+ floors and multiple shaft transitions to find.
  - **All coins on traversable paths**: 16 coins placed exclusively on solid floors, platforms, or intermediate shaft platforms that the player must visit.
  - **Enemy boundary safety verified**: all 8 enemies (2 ground, 3 patrol, 3 jumper) are placed on solid sections with no risk of falling outside the level boundaries (x=0, x=63).
  - **Goal room** remains at Floor 5 (y=18, S2) behind a key door at (30, 19), guarding a distinct room space with the goal at (34, 20).
  - **Removed entry steps**: no longer needed since ground-to-floor jumps are ≤ 5.5 tiles directly.

- **export-levels.mjs**: `buildTreasureTower` rewritten with data-driven floor section system (`floorDefs` array mapping y-coordinates to active section indices) and `sectionRanges` lookup table, replacing the previous pillar-blocking approach.

## [0.51.0] - 2026-06-12

### Added

- **Tile `collision` field**: tiles now support a top-level `collision?: boolean` field alongside the legacy `solid`. The runtime prefers `collision ?? solid ?? true` — `collision` is written by the editor collision toggle, and `solid` is preserved for backward compatibility with existing JSON levels.
- **`TileProperties` typed interface**: `properties` on Tile is now typed as `TileProperties` instead of `Record<string, unknown>`, with explicit fields `moveAxis?: MoveAxis`, `moveSpeed?: number`, `moveRange?: number`. The Zod schema (`level.schema.ts`) validates these fields via `tilePropertiesSchema`.
- **Moving platforms in sample levels**: Sky Fortress (horizontal platforms at x=24, y=56, range 64px, speed 60), Underground (vertical platform at x=36, y=55, range 48px, speed 50), Treasure Tower (vertical platform at x=25, y=53, range 64px, speed 40). These demonstrate the moving platform feature in real level contexts.

### Changed

- **level.schema.ts**: `tileSchema` now accepts optional `collision` boolean and uses `tilePropertiesSchema` with `moveAxis`/`moveSpeed`/`moveRange` fields instead of `Record<string, unknown>`.
- **RuntimeScene.ts**: moving platform logic uses the typed `TileProperties` values; tile solidity resolved via `collision ?? solid ?? true`.
- **editorStore.ts**: `updateTileSolid` now sets both `collision` and `solid` on the tile, ensuring new levels serialise with `collision` instead of `solid`.
- **EditTargetInspector.tsx**: reads `collision ?? solid ?? defaultSolid` for the collision toggle display value.
- **export-levels.mjs**: generates `properties` with `moveAxis`/`moveSpeed`/`moveRange` for moving platforms in the sample levels. JSON files regenerated.

## [0.50.0] - 2026-06-12

### Changed

- **Sample levels now serialized as standalone JSON files**: levels are generated via `scripts/export-levels.mjs` and stored in `src/data/levels/*.json` and `public/levels/*.json`. The TypeScript source `sampleLevels.ts` now imports from JSON instead of generating levels inline. This ensures the level format is decoupled from TypeScript/Phaser, aligned with AGENTS.md.
- **Treasure Tower tower entries**: added stepped platforms at y=60 inside each tower section (left, middle-left, middle-right, right) so the player has clear ground-level entry points into every tower section.

### Fixed

- **RuntimeScene.ts**: patrol and jumper `tex.add()` calls now use string keys `"0"` and `"1"` instead of numeric keys, preventing Phaser from falling back to `__BASE` frame which showed the full sprite sheet as a single frame.
- **RuntimeScene.ts**: patrol and jumper frame 1 now shifts ALL child elements by `dy=-4` (not just body elements), keeping relative positions consistent and preventing visual overlap/merge artifacts between frames.
- **RuntimeScene.ts**: patrol and jumper frame `"1"` registered with correct `width=32` instead of `width=64` (was reading beyond the 64px-wide texture).

## [0.44.0] - 2026-06-11

### Changed

- **spike.svg**: redesigned as a single centered triangular spike (8-bit, square 4px blocks) with right-side shadow for 3D depth.
- **RuntimeScene.ts**: updated `runtime-spike` texture to match new single-triangle design.
- **package.json**: bump version to 0.44.0.

## [0.43.0] - 2026-06-11

### Changed

- **spike.svg**: redesigned with 4 triangular spike points (bright red with dark shading) and textured base block.
- **ground.svg**: converted to square 4px pixel blocks — horizontal bands and scattered rocks now use multiples of 4px.
- **brick.svg**: converted to square 4px pixel blocks — running bond pattern with 12×8px bricks and 4px mortar gaps.
- **RuntimeScene.ts**: updated `runtime-ground`, `runtime-spike`, and `runtime-brick` textures to match new SVGs.
- **package.json**: bump version to 0.43.0.

## [0.42.0] - 2026-06-11

### Changed

- **player.svg**: redesigned player sprite with improved Mario+Mega Man hybrid pixel art (wider cap, prominent helmet ear pieces, cleaner body proportions, better cannon design, taller boots).
- **RuntimeScene.ts**: updated `runtime-player` texture to match new SVG design.
- **package.json**: bump version to 0.42.0.

## [0.41.0] - 2026-06-11

### Changed

- **All sprites are now 8-bit pixel art**: SVGs in `public/sprites/` and runtime textures in `RuntimeScene.ts` redesigned with blocky pixel art style. Replaced smooth shapes (`fillCircle`, `fillTriangle`, `fillCircle`, `rx` rounded corners, line strokes) with sharp `fillRect`-based pixel art using 4px granularity on an 8×8 grid per 32×32 tile.
  - `public/sprites/*.svg`: 11 SVG files rewritten with `<rect>`-based pixel art (no circles, no rounded corners, no smooth curves).
  - `engine/runtime/RuntimeScene.ts`: `createRuntimeTextures()` rewritten — all `fillCircle`/`fillTriangle`/`lineStyle`/`strokeRect` calls replaced by `fillRect` pixel blocks matching the SVG pixel art.
  - `components/editor/GridCell.tsx`: added `imageRendering: "pixelated"` to sprite style for crisp pixel display in the editor canvas.
  - `components/editor/ToolPanel.tsx`: added `imageRendering: "pixelated"` to all tile and entity preview images.

## [0.40.9] - 2026-06-10

### Changed

- **Removed 2 sample levels**: `firstSteps` (redundant basic platform) and `dangerPass` (redundant spike level) removed from `sampleLevels` array and i18n.
- **Treasure Tower now has a door + key puzzle**: added `door` entity at (6, 9) blocking the goal and `key` entity at (9, 23) on a mid-tower platform. Player must collect the key to open the door and reach the treasure.
- **Added `doorAt()` and `keyAt()` helper functions** in `sampleLevels.ts` for concise entity creation.

### Removed

- **i18n entries for `firstSteps` and `dangerPass`** removed from translation dictionary.

## [0.40.8] - 2026-06-10

### Added

- **`makeLegato` now supports `cycleLength` parameter**: when provided, the last note in the sequence is extended to `cycleLength - lastNote.beat + overlapBeats` instead of just `lastNote.dur + overlapBeats`.
- **`docs/music-system.md`**: comprehensive documentation of the music generation system covering architecture, synthesis, ADSR envelopes, sequencer/reverb, 16-beat cycle structure, harmonic progressions, unresolved endings, percussion patterns, and version history.

### Changed

- **All 5 themes now have harmonically unresolved endings**: the last note of each melody is no longer the tonic (resolved), but a non-chord tone or leading tone that creates tension — tension that resolves when the loop restarts to the first note. This creates a true continuous-loop effect where the ear demands the cycle to repeat.
  - `calm`: last note C4 → D4 (supertonic, 9th of Cmaj7, resolves to E4 at beat 0)
  - `adventure`: last note C4 → B3 (leading tone, resolves to C4 at beat 0)
  - `retro`: last note G4 → B4 (leading tone of C major, resolves to C5 at beat 0)
  - `mystery`: last note C4 → F4 (subdominant of Cm, resolves to G4 at beat 0)
  - `boss`: last note C4 → G4 (dominant of Cm, resolves to C4 at beat 0)

- **All 5 themes restructured as true 16-beat cyclic patterns**: every layer (chords, melody, bass, drone) spans exactly 16 beats with its last note/chord extending to overlap into beat 0 of the next cycle. This ensures the musical material is continuous at the loop point without relying on the 50ms crossfade to mask gaps.
  - Chords: last chord dur changed to 4.5 (was 5) to end at beat 16.5
  - Percussion extends to cycle boundary (extra beat at beat 16/17)

- **All 5 WAV files regenerated**: lengths slightly adjusted for exact 16-beat cycles:
  - calm: 12.82s → 12.78s
  - adventure: 8.52s → 8.49s
  - retro: 5.11s → 5.17s
  - mystery: 17.16s → 17.16s (unchanged)
  - boss: 7.32s → 7.37s

## [0.40.7] - 2026-06-10

### Fixed

- **All WAVs had trailing silence making loops uneven**: `reverb()` used a hardcoded 0.5s extra padding (`Math.floor(SR * 0.5)`), adding unnecessary silence after every theme. Changed to dynamic padding (`Math.floor(SR * 0.005) + maxEcho`) based on actual delay line length, so the reverb tail ends naturally at the last audible sample.

### Added

- **`makeLoopable(signal, fadeSec, noiseFloor)` function**: trims all trailing samples below a noise floor threshold (0.001, ≈32 at 16-bit) plus a 5ms safety margin, then applies a linear crossfade from the last `fadeSec` (50ms) into the first `fadeSec` of the audio. This ensures seamless looping — when Phaser jumps from the end of the WAV back to the beginning, the waveform is continuous with no pop or click.
  - Applied to all 5 themes in the main generation loop.
  - All WAVs now have 100% non-zero samples (mystery: 99.9% due to intentional sparse ambient pauses).

### Changed

- **All 5 WAV files regenerated**: each is now trimmed to its natural loop point with a crossfaded transition. File sizes reduced proportionally to removed silence (e.g., boss: 7.8s → 7.32s, mystery: 17.6s → 17.16s).

## [0.40.6] - 2026-06-10

### Fixed

- **Boss music no longer has silent zones**: `NaN` propagation caused by undefined note frequencies (`Ab3`, `Eb2`, `Eb3`, `Bb3`) in the pitch map `scripts/generate-music.mjs:247`. When the boss theme referenced these notes (beats 1-3: `Ab3`; beats 4-12: `Eb2`/`Eb3`/`Bb3`), `Math.sin(2 * PI * undefined * t)` produced `NaN`, which spread through `mix()` and was written as zero-samples by `Buffer.writeInt16LE(NaN)` → 3.48s of total silence (0.43-0.92s and 1.72-5.19s). Now audio is 93.5% non-zero vs previously 43%.

- **Mystery music also had silent zones from the same `NaN` bug**: `F.Eb5` (beat 4) and `F.Eb6` (beat 9.5) were undefined in the pitch map, used by the eerie highs layer. Each caused ~1.68s of total silence (4.00-5.68s and 9.50-11.18s). Non-zero went from 78.5% → 97.6%.

- **Percussion always silent**: `percSequence()` wrapped beats as `{ f: 0, ... }` and passed them to `sequence()`, which called `voiceFn(n.f, dur, n.vel * velScale)`. Since `kick` and `snare` used their first parameter as velocity, they received `freq=0` as `vel`, multiplying output by zero. Fixed by adding unused `_f, _dur` parameters to `kick()` and `snare()`.

### Changed

- **Missing note frequencies added**: `Ab3: 207.65`, `Eb2: 77.78`, `Eb3: 155.56`, `Bb3: 233.08`, `Eb5: 622.26`, `Eb6: 1244.52` added to the `F` map in `scripts/generate-music.mjs`. All 37 referenced frequencies now have entries.

## [0.40.5] - 2026-06-10

### Changed

- **Mystery theme completely redesigned**: replaced the ultra-slow `etherealPad` (1.5s attack / 2s release) with a warmer `stringPad` (0.3s attack / 0.5s release) with detuned harmonics for richness. Added a continuous slow-moving triangle melody that never goes silent (11 notes covering all 16 beats). Doubled the high eerie note density (from 6 to 9 notes). Increased wind texture volume and drone volume. All layers now overlap continuously with no gaps between chords or phrases.

- **Boss theme fixed**: power chord riff was using `half = tempo / 2` as its timebase, producing a 14.6s output array while the melody/bass/drums only lasted ~7s. The last 7.7s had only the riff playing, then silence. Changed the riff to use the same `tempo` as all other layers, so every layer ends at roughly the same time (~7.5s) and the loop transition is seamless. Reduced file size from 1304 KB to 676 KB.

- **Removed unused `etherealPad` function**: replaced by `stringPad`.

- **Final silence padding reduced**: `sequence()` and `chordSequence()` padding reduced from `+ 0.05` to 50ms (previously `+ 1` = 1 second in v0.40.3 and earlier). All 5 WAV files regenerated with zero trailing silence.

## [0.40.4] - 2026-06-10

### Fixed

- **No more silence gap at end of music loops**: `sequence()` and `chordSequence()` in `scripts/generate-music.mjs` added a full 1 second of silent padding (`+ 1`) to the total duration, plus `reverb()` added another 0.5s tail. When Phaser looped the WAV, ~1s of silence played between each repeat. Reduced to `+ 0.05` (50ms) — just enough to avoid clipping, while the reverb tail provides the natural fade. All 5 WAV files regenerated ~1s shorter.

## [0.40.3] - 2026-06-10

### Fixed

- **Player no longer clips through ground on respawn**: when the player dies and respawns at the initial spawn point or checkpoint, the Y position is now offset by `-TILE_SIZE` (one cell up, -32px). Previously the player was placed at the exact tile center, which could embed them inside the ground tile, causing physics clipping. Now the player appears one tile above the ground and falls naturally onto it.
  - `engine/runtime/RuntimeScene.ts`: `onHitSpike()` respawn offset applied to both checkpoint and initial spawn position.

## [0.40.2] - 2026-06-10

### Changed

- **All 5 music themes now play continuously with no silent gaps**: every theme now includes a constant low-frequency drone (C2 sine) that sustains through the entire loop, ensuring sound is always audible. Chord pads and bass lines use overlapping durations (extended by 0.5 beats) to eliminate gaps between chord changes. Melody lines use a new `makeLegato()` helper that extends each note's duration to overlap with the next note by 0.03 beats, creating a seamless legato flow across all melodic phrases. Previously, phrases were separated by brief silences and chords had 0-beat transitions; now all layers interlock continuously.
  - `scripts/generate-music.mjs`: added `makeLegato(notes, overlapBeats)` function.
  - `scripts/generate-music.mjs`: calm, adventure, retro, mystery, and boss all updated with drone layer, legato melodies, and overlapping harmonic durations.

## [0.40.1] - 2026-06-10

### Changed

- **Music system replaced: programmatic synthesis → pre-generated WAV files**. The 5 music tracks are now actual WAV audio files generated by `scripts/generate-music.mjs` and loaded from `/sounds/music/*.wav`, instead of being synthesized at runtime via Web Audio API oscillators. Each track now has layered chord progressions, proper mixing, and sounds like real music rather than beeps.
- **Melodies completely rewritten**: all 5 themes now use proper musical arrangements with:
  - Full chord progressions (Cmaj7, Am7, Fmaj7, etc.) via stacked sine voices with detuning
  - Dedicated instrument voices: warm pad (detuned sine stacks), triangle lead, bass (sine + sub-octave), kick drum (sine sweep + noise), snare drum (noise + sine)
  - ADSR envelopes on every voice for natural attack/decay
  - Dynamic velocity variation per note for expression
  - Built-in delay-based reverb for spatial depth
  - Percussion elements (kick + snare patterns) for rhythm in adventure, retro, and boss
  - Proper tempo-based timing grid

### Fixed

- **Mystery theme redesigned**: replaced harsh Cm(add#4) cluster chord with a smoother jazz-influenced harmonic progression (Dm9 → G13sus4 → Cm9). Added slow tremolo pulsing on the pad for unease, wind texture (filtered noise with LFO), ethereal high notes with very slow attack, and deeper reverb.
- **Boss theme redesigned**: replaced complex chord changes with a static C power-chord riff (C5 - Eb5 - F5 - G5) for relentless drive. Added pounding sawtooth+bass hybrid on every 8th note for intensity. Simplified melody to a chromatic descent pattern. Both kick (every beat) and snare (2,4) for constant percussive energy. Includes a chromatic descending run (C4→Db4→D4→Eb4→C4) as a tension-building figure.
  - `scripts/generate-music.mjs`: new build-time script that generates multi-layered WAV files with chords, pads, bass lines, and percussion-like elements for each theme.
  - `public/sounds/music/`: contains calm.wav, adventure.wav, retro.wav, mystery.wav, boss.wav.
  - `engine/runtime/RuntimeScene.ts`: `setupMusic()` now loads and plays the WAV file as a Phaser sound loop. Removed the `generateMusicBuffer` import.
  - `engine/runtime/music-generator.ts`: **deleted** — replaced by pre-generated WAV files.
  - `engine/runtime/index.ts`: removed `generateMusicBuffer` export.

### Fixed

- Background music no longer sounds like raw oscillator beeps. Each theme now has proper harmonies, dynamic range, and musical structure.
- **Music theme now actually passes through to runtime**: `EditorShell.tsx` was not destructuring `music` from `editorStore`, nor including it in the `levelData` object passed to `GameRuntime`. The runtime always fell back to `"calm"`. Added `music` to destructuring, memoized object, and dependency array.

## [0.40.0] - 2026-06-10

### Added

- **Background music system**: levels now support a `music` field (MusicTheme) with 5 selectable tracks. Tracks are generated programmatically via Web Audio API in `engine/runtime/music-generator.ts`.
  - `types/level.ts`: added `MusicTheme` type (`"calm" | "adventure" | "retro" | "mystery" | "boss"`) and `music?: MusicTheme` field to `LevelData`.
  - `types/level.schema.ts`: added `music` field with `z.enum([...]).optional().default("calm")`.
  - `stores/editorStore.ts`: added `music` state, `setMusic` action, `music` in `loadLevel`/`resetLevel`.
  - `components/editor/MusicPicker.tsx`: new UI component in the Inspector (below BackgroundPicker) with 5 colored buttons with musical symbols, following the same pattern as `BackgroundPicker`.
  - `lib/i18n.ts`: 12 new translation keys (`music.title`, `music.calm`, `music.adventure`, `music.retro`, `music.mystery`, `music.boss`, `music.setAria`) in EN/ES.
  - `engine/runtime/music-generator.ts`: new module that generates AudioBuffer melodies for each theme using Web Audio API with distinct waveforms, harmonies, and registers. Calm uses sine+triangle legato arpeggios; Adventure uses square-wave march with bass fifths; Retro uses fast 8-bit square arpeggios; Mystery uses triangle drones with vibrato and eerie intervals; Boss uses aggressive sawtooth+square riff.
  - `engine/runtime/RuntimeScene.ts`: calls `setupMusic()` in `create()` which generates and plays the loop. Music stops on game over, victory, or scene shutdown.
  - `data/sampleLevels.ts`: all 10 sample levels have an assigned music theme.

### Changed

- `package.json`: version 0.39.2 → 0.40.0.

## [0.39.2] - 2026-06-10

### Changed

- **Phaser preloading**: Phaser now starts loading immediately when the editor mounts (via `EditorShell`'s `useEffect`), rather than waiting for the user to click Play. In `GameRuntime`, replaced `await import("phaser")` with `await preloadPhaser()` which uses a cached module-level promise, so subsequent plays resolve instantly.
- **Renderer switched to AUTO**: Changed `PhaserLib.CANVAS` to `PhaserLib.AUTO` — Phaser will use WebGL when available (hardware-accelerated, much faster) and fall back to Canvas otherwise.

### Fixed

- **Camera no longer lags when centering on the player**: added `this.cameras.main.centerOn(this.player.x, this.player.y)` before `startFollow()` in `RuntimeScene.create()`. Previously the camera defaulted to (0,0) and slowly slid to the player over ~0.5s due to lerp 0.08; now it snaps to the player instantly on scene start.
- **Runtime section centers instantly in viewport**: replaced `scrollIntoView({ behavior: "smooth", block: "start" })` with `scrollIntoView({ block: "center" })`. The smooth scroll animation was causing an artificial delay, and `block: "start"` aligned the runtime to the top of the viewport instead of centering it. Now the runtime section snaps to vertical center immediately on Play.
- **Canvas no longer overshoots height on initialization**: replaced `min-h-[480px]` on the Phaser container div with `style={{ height: canvasHeight }}` computed from the level dimensions (`Math.min(level.height * 32, 720)`). Previously the container defaulted to 480px, and the canvas (often smaller) would slowly shrink to its correct size during WebGL initialization. Now the container is exactly the canvas height from the first render, with no visual adjustment.

### Added

- **`src/lib/phaser.ts`**: new preloader module. Exports `preloadPhaser()` which starts `import("phaser")` on first call and caches the resulting promise.

## [0.39.1] - 2026-06-10

### Fixed

- **Runtime performance: page no longer lags when scrolling during gameplay**. Editor panels (`ToolPanel`, `LevelCanvas`, `InspectorPanel`) and `DndContext` are no longer rendered when `isPlaying` is `true`, eliminating the cost of compositing thousands of dnd-kit grid cells alongside the Phaser canvas. Body overflow is locked during runtime to prevent accidental page scroll.

## [0.39.0] - 2026-06-10

### Added

- **Phaser runtime i18n**: all user-facing strings in the game runtime (`RuntimeScene.ts`) now use the locale system. "GAME OVER", "LEVEL COMPLETE"/"NIVEL COMPLETADO", "Retry"/"Reintentar", "Stop"/"Detener", "Checkpoint!", "Need a key!", "Door opened!", "Place a player to start" and lives counter all switch between English and Spanish according to the selected locale.

### Changed

- **Default locale changed to English**: `localeStore` default changed from `"es"` to `"en"`. The `<html lang>` attribute in `layout.tsx` defaults to `"en"`. Page metadata (title, description, keywords, Open Graph) updated to English.
  - `createRuntimeScene()` now receives `locale` via context and passes it to scene `init()`.
  - `RuntimeScene` stores `this.locale` and provides a `this.t()` method backed by the shared `translations` dictionary in `lib/i18n.ts`.
  - Added 11 new translation keys under `runtimeScene.*` in `lib/i18n.ts`.

### Fixed

- **Sample level translations now work**: i18n keys in `lib/i18n.ts` used camelCase (`firstSteps`, `coinRun`) but level IDs in `data/sampleLevels.ts` use kebab-case (`first-steps`, `coin-run`). Changed 16 translation keys to match the actual kebab-case IDs, so sample level names and descriptions now switch language correctly.
- **Fixed typo in Spanish description**: "estrella" → "estrecha" for the Underground level description.
- **`<html lang>` attribute now dynamic**: new `LangSetter` client component reads the Zustand locale store and updates `document.documentElement.lang` on change, fixing accessibility (screen readers now get the correct language).
- **Dead code removed**: removed unused `BACKGROUND_LABELS` constant from `types/level.ts` and unused `SPRITE_LABELS` constant from `assets/index.ts`, both of which contained hardcoded Spanish strings not used anywhere in the UI.

## [0.38.0] - 2026-06-10

### Added

- **Internationalization (i18n)**: the editor now supports switching between English and Spanish. A new language toggle button (EN/ES) in the header switches all UI text dynamically.
  - `lib/i18n.ts`: centralized translation dictionary with ~100 keys covering all visible text in the editor and runtime.
  - `stores/localeStore.ts`: Zustand store with `locale` state and `setLocale` action.
  - `hooks/useTranslate.ts`: `useT()` hook that returns a `t(key, params?)` function with `{{param}}` interpolation.
  - Updated all components (`EditorShell`, `ToolPanel`, `LevelCanvas`, `InspectorPanel`, `BackgroundPicker`, `EditTargetInspector`, `EntityProperties`, `SampleLevels`, `GridCell`, `CameraControls`, `GameRuntime`) to consume translations via `useT()`.
  - Default locale remains `"es"` (Spanish) so no existing tests are affected.

## [0.37.0] - 2026-06-09

### Added

- **6 additional sample levels**: Sky Fortress (ascending platforms, sunset), Underground (cave tunnels, purple), Speed Run (flat sprint, desert), Treasure Tower (vertical climb, forest), Bridge of Spikes (narrow platforms over spike pit, dark), Vertical Descent (narrow shaft descent, sky). Each level features distinct terrain, enemies, coins, and environmental hazards.

## [0.36.0] - 2026-06-09

### Added

- **Sample Levels panel**: new section below the ToolPanel in the editor sidebar. Displays a list of pre-made levels (Empty, First Steps, Coin Run, Danger Pass) as buttons. Clicking one calls `editorStore.loadLevel()` to load the level into the editor. Includes a `src/data/sampleLevels.ts` module with the level definitions and a `SampleLevels.test.tsx` file with 6 tests covering rendering and load behavior.

## [0.35.1] - 2026-06-09

### Removed

- **Layer system**: completely removed. Deleted `LayerBar`, `layerStore`, the `Layer` type, `LAYERS`/`LAYER_NAMES`/`LAYER_VISIBLE_DEFAULT` constants, and the `layer` field from `Tile`, `PaintAction`, and `tileSchema`. Removed the `visibleLayers` filter from `LevelCanvas` and the `activeLayer` reference from `EditorShell`.
- **Grid dimension badge**: removed the `{width}x{height} grid` indicator from `LevelCanvas` header and its corresponding test.
- **"Fit map to viewport" button**: removed the `⊡` button from `CameraControls`, its `onFitToMap` prop, and the `handleFitToMap` function from `LevelCanvas`. Removed `fitToMap` from `useEditorCamera` return value. The underlying `cameraStore.fitToMap` implementation is preserved.

## [0.35.0] - 2026-06-09

### Added

- **EditorShell tests**: 10 tests covering header rendering, Play/Stop buttons, Editor active/Runtime active states, ToolPanel/LevelCanvas/InspectorPanel panels, grid element, and store state verification (src/components/EditorShell.test.tsx).
- **useTileBrush tests**: 10 tests covering hook properties, makeAction (tile/erase/entity/null), getCellFromEvent (null/no zoom/with zoom/out of range), and startBrush/endBrush state management (src/hooks/useTileBrush.test.ts).
- **Custom README.md**: replaced the default Next.js template with GameForge project documentation, stack, commands, testing and architecture.

### Fixed

- **BackgroundPicker.test.tsx**: fixed queries that used English labels ("Dark", "Cave", "Sky", "Forest", `/set background to sky/i`) to use the actual Spanish labels from the component (Oscuro, Cielo, Bosque, Desierto, `/set background to ciel/i`).
- **EditTargetInspector.test.tsx**: fixed spread of `{...baseProps}` which overwrote `tiles={tiles}` with `tiles: []`, causing the speed/range input tests to fail because no tile was found.
- **EntityProperties.test.tsx**: fixed `getByLabelText(/property value/i)` query that matched two inputs (Property value + New property value), replaced with `getByDisplayValue("10")`. Also replaced `userEvent.clear()` with `fireEvent.change` due to incompatibility with controlled inputs in jsdom.
- **EditorShell.test.tsx**: added mock for `Element.prototype.scrollIntoView` to avoid TypeError in jsdom.

## [0.34.0] - 2026-06-09

### Fixed

- **Relative font sizes (`rem`/`em`)**: replaced 8 uses of `text-[10px]` and `text-[8px]` with `text-[0.625rem]` and `text-[0.5rem]` in `ToolPanel.tsx`, `LayerBar.tsx`, `CameraControls.tsx` and `BackgroundPicker.tsx`, complying with Lighthouse's requirement for relative units.

### Changed

- **Docs unified to keepachangelog format**: all 22 files in `/docs` converted to `## [X.Y.Z] - YYYY-MM-DD` format with `Added`, `Changed`, `Fixed`, `Security`, `Removed` sections. This aligns the project with AGENTS.md line 484 ("Files must follow the structure defined in Keep a Changelog").
- **CHANGELOG.md fixed**: added required `[Unreleased]` section per keepachangelog, merged duplicate `### Fixed` section in v0.30.0.

## [0.33.0] - 2026-06-09

### Changed

- **Structure migrated to `src/`**: all application folders (`app/`, `components/`, `features/`, `engine/`, `stores/`, `hooks/`, `lib/`, `types/`, `assets/`) moved under `src/`, aligning the project with AGENTS.md specification (lines 120-135). Next.js auto-detects `src/app/`. Path alias `@/*` updated to `./src/*` in `tsconfig.json` and `vitest.config.ts`.

## [0.30.0] - 2026-06-09

### Added

- **Tests for hooks, utils and components**: created `lib/utils.test.ts`, `hooks/useEditorCamera.test.ts`, `components/editor/GridCell.test.tsx`, `components/editor/LayerBar.test.tsx`. Total: 17 test files, 149 tests (+25 tests).

### Changed

- **`useTileBrush` hook improved and connected to LevelCanvas**: the hook now includes `startBrush`, `endBrush`, `getPendingActions`, `clearPendingActions` and `getCellFromEvent` with zoom support. `LevelCanvas.tsx` refactored to use the hook instead of duplicating paint logic, removing ~60 lines of duplicated code.
- **LayerBar accessibility redesigned**: replaced `onDoubleClick` (not accessible for keyboard/screen readers) with `onContextMenu` (right-click) to activate a layer. Added `aria-pressed`, `role="group"`, and state description (`visible`/`hidden`) in `aria-label`.
- **Lighthouse reports moved to `/reports/`**: 9 audit JSON files moved from root to `reports/` for project tidiness.

### Fixed

- **`docs/lighthouse-exceptions.md` outdated**: updated to reflect desktop 100/100/100/100 (not 92). Documented mobile exception (56/100) and tablet (not run). Added history with current version.
- **CLS on mobile (0.518 → 0)**: `ToolPanel` was imported with `ssr: false` (legacy from a hydration mismatch with dnd-kit in v0.7.1, already removed in v0.11.0). During SSR it was not rendered, the wrapper collapsed to 0px, and when loaded on the client it pushed all content down.
  - Changed to static import (`import { ToolPanel }`), removing `next/dynamic` with `ssr: false`.
  - Added `min-h-[300px]` to ToolPanel wrapper and `min-h-[400px]` to canvas container as safety net.
  - Added `min-h-[200px]` to the `<section>` in LevelCanvas to reserve space during loading.

### Performance

- **Removed forced reflow in paint-by-drag**: `useTileBrush` exposes `gridRect` as a mutable ref. `LevelCanvas.handleMouseDown` reads `getBoundingClientRect()` once at click start and assigns it to `gridRect.current`. During subsequent `mousemove` events, `getCellFromEvent` only reads the cached ref — zero DOM geometry reads on the hot path.
- **Removed `readGridRect()` fallback in `getCellFromEvent`**: the method now returns `null` if no rect is cached, instead of performing a live read. This forces the caller to provide the rect explicitly (in `handleMouseDown`), removing the double `getBoundingClientRect()` read that occurred per mousedown.
- **`cameraStore.centerView` refactored**: replaced 4 sequential reads (`clientWidth`, `clientHeight`, `scrollWidth`, `scrollHeight`) with 2 `getBoundingClientRect()` calls (1 for the grid, 1 for the parent), eliminating layout thrashing on that path.

## [0.28.0] - 2026-06-09

### Added

- **Lazy loading for GameRuntime**: the `GameRuntime` component (Phaser) is now imported with `next/dynamic` and `ssr: false`, removing ~5.7 KB from the initial bundle. Phaser is only downloaded when clicking "Play".

### Changed

- **RuntimeScene migrated to `engine/runtime/`**: the `RuntimeScene` class (870+ lines of Phaser logic) was extracted from the React wrapper `GameRuntime.tsx` to `engine/runtime/RuntimeScene.ts` via factory pattern `createRuntimeScene(PhaserLib, ctx, toggleDebugRef)`. `GameRuntime.tsx` reduced from 871 to ~140 lines (~84% reduction).
- **Editor logic extracted to `engine/editor/`**: created `engine/editor/paint-actions.ts` with pure functions `applyPaintActions`, `createId`, `isUniqueEntity`. The `editorStore.ts` imports from `@/engine/editor` instead of containing inline logic.
- **`features/` and `assets/` populated**: `features/editor/index.ts`, `features/runtime/index.ts`, `features/index.ts` and `assets/index.ts` now export meaningful constants and re-exports (SPRITE_PATHS, SPRITE_LABELS, CELL_SIZE, RUNTIME_TILE_SIZE).

### Fixed

- **E2E tests (3 tests)**: updated assertions in `e2e/editor.spec.ts`:
  - Removed obsolete assertion for "Assets" heading (removed in v0.25.0).
  - Changed selected class assertions from `bg-slate-700` → `bg-amber-500/20` (new amber selection visual state).
- **Lint warning in LevelCanvas.tsx**: added `setSelectedEditTarget` dependency to `useEffect` array on line 296.
- **Lighthouse accessibility**: fixed `heading-order` (h3→h2), `color-contrast` (text-slate-500/600→text-slate-400) and `label-content-name-mismatch` (layer buttons with number in aria-label).

### Performance

- Lighthouse: accessibility 100, best-practices 100, seo 100. Performance 92 on production server (editor weight).

## [0.27.0] - 2026-06-09

### Added

- **Customizable level background**: new `background` field in `LevelData` (`BackgroundTheme` type). Six available themes: Dark (default), Sky, Forest, Desert, Sunset and Purple.
  - `types/level.ts`: added `BackgroundTheme` types, `BACKGROUND_COLORS` and `BACKGROUND_LABELS` constants.
  - `types/level.schema.ts`: `background` field with `z.enum()` and default `"dark"`.
  - `stores/editorStore.ts`: new `background` state, `setBackground` action, included in `loadLevel`/`resetLevel`.
  - `components/editor/InspectorPanel.tsx`: visual background picker with color circles and labels.
  - `components/editor/LevelCanvas.tsx`: the editor grid shows the selected background color.
  - `components/runtime/GameRuntime.tsx`: the Phaser runtime uses the level's `backgroundColor`.

## [0.26.0] - 2026-06-09

### Removed

- **Inspector entity list**: removed the interactive entity list in `InspectorPanel.tsx` (`<div className="space-y-2"><h3>Entities</h3>...`). Entities are now selected only from the canvas using the Edit tool. Editing properties of the selected entity is preserved.

## [0.25.0] - 2026-06-09

### Removed

- **AssetExplorer**: removed the `AssetExplorer.tsx` panel and its import in `EditorShell.tsx`. Element selection is now done exclusively from `ToolPanel.tsx`, which already has the same functionality and appearance.

## [0.24.0] - 2026-06-09

### Changed

- **ToolPanel redesigned with asset grid**: the element selection panel (`ToolPanel.tsx`) now has the same appearance as `AssetExplorer.tsx` — 4-column grid with sprite previews (24×24) and `text-[8px]` labels, same dark card styles with hover/selected amber states.
- **ToolPanel.test.tsx**: updated selected class assertion from `bg-slate-700` to `bg-amber-500/20` to match the new style.

### Removed

- **TileRow and EntityRow**: removed the individual row components (`TileRow`, `EntityRow`) and `SpritePreview`. Tiles and entities now render directly as grid buttons within the panel.

## [0.23.0] - 2026-06-08

### Added

- **Platform movement**: platforms can now be configured in the inspector (edit mode) to move vertically (Up-Down) or horizontally (Left-Right). Speed and movement range can be adjusted.

### Changed

- **Directionless spikes**: removed the directional `processCallback` in the player-spike collision. Any contact with a spike (regardless of side) now kills the player. The "safe side" of the base no longer exists.
- **Tile properties**: added `properties?: Record<string, unknown>` field to the `Tile` interface and Zod schema, allowing per-tile data storage (consistent with the `Entity` interface).
- **`updateTileProperty` action**: new action in `editorStore` to modify individual tile properties.

### Changed

- `types/level.ts`: `Tile` now includes `properties?: Record<string, unknown>`.
- `types/level.schema.ts`: `tileSchema` accepts optional `properties` with transform to empty object.
- `stores/editorStore.ts`: added `updateTileProperty(x, y, key, value)` action.
- `components/editor/InspectorPanel.tsx`: "platform" type tiles in edit mode now show direction controls (None/Up-Down/Left-Right), speed and range.
- `components/runtime/GameRuntime.tsx`: platforms with `moveAxis` other than "none" are created in a dynamic group and move in the `update()` loop with configurable speed and range.

## [0.22.0] - 2026-06-08

### Added

- **Edit tool**: new "Edit" button in the tool panel. When activated, clicking any tile or entity on the canvas shows and modifies its properties in the inspector.
- **Element inspector**: when selecting an element in edit mode, the inspector shows its name (read-only), coordinates (read-only) and a collision toggle (ON/OFF).
- **Per-element collision**: tiles now have an optional `solid` property that overrides the type's default solidity. If disabled, the tile renders without physics (decoration).
- **Tile `solid?: boolean`**: added optional field to the `Tile` interface and Zod schema.

### Changed

- `stores/selectionStore.ts`: added `"edit"` to `ToolMode`, new `EditTarget` type and `selectedEditTarget` state.
- `stores/editorStore.ts`: added `updateTileSolid(x, y, solid)` action for per-tile collision toggle.
- `components/editor/ToolPanel.tsx`: added "Edit" button next to "Erase".
- `components/editor/LevelCanvas.tsx`: in edit mode, clicking selects the element as an edit target without painting/erasing. `GridCell` highlights the element selected for editing in amber.
- `components/editor/InspectorPanel.tsx`: new section showing properties (name, coordinates, collision) of `selectedEditTarget`.
- `components/runtime/GameRuntime.tsx`: tile creation respects `tile.solid` — if `false`, it is created without a physics body (visual only).

## [0.21.0] - 2026-06-08

### Added

- **Victory screen**: reaching the goal shows "LEVEL COMPLETE" overlay with Retry (restarts level) and Stop (returns to editor) buttons.
- **Game Over screen**: losing all lives shows "GAME OVER" overlay with Retry and Stop buttons.
- **Paused physics on screens**: the physics world pauses when showing victory or Game Over (enemies, gravity and collisions stop).
- **Enemies collide with doors**: `enemyLayer` now also collides with `doorLayer`, enemies bounce off doors like solid tiles.

### Changed

- `GameRuntime.tsx`: `onReachGoal` replaced by `showVictory()`. Added `showGameOver()` with overlay and interactive buttons. Added `this.physics.world.pause()` on both screens. Added collider between `enemyLayer` and `doorLayer`.

## [0.20.0] - 2026-06-08

### Added

- **3-lives system**: the player starts with 3 lives. Each death (spike, enemy, void fall) subtracts 1 life. At 0, Game Over.
- **Respawn at start**: on death with remaining lives, the player respawns at the initial level position, or at the checkpoint if activated.
- **Lives HUD**: "♥ x3" indicator in the top-left corner of the runtime that updates when losing lives.

### Changed

- `GameRuntime.tsx`: refactored `onHitSpike()` to manage lives, respawn and Game Over. Void fall death now calls `onHitSpike()` instead of maintaining duplicate logic.
- `GameRuntime.tsx`: saved the player's initial position (`spawnX`/`spawnY`) on creation.

## [0.19.0] - 2026-06-08

### Added

- **Door with physical collision**: the door now uses `collider` instead of `overlap`, so it physically blocks the player until they have the key.
- **Door opening with key**: touching the door with `hasKey = true` destroys the door (clearing the path) without completing the level. The level is only completed by reaching the `goal` entity.

### Changed

- `GameRuntime.tsx`: `doorLayer` changed from `this.physics.add.overlap` to `this.physics.add.collider`. The `onTryDoor` callback now receives the door object and destroys it on opening, without playing victory sound or pausing the scene.

### Fixed

- The door is no longer merely a visual obstacle — it now physically stops the player until the key is obtained.
- Opening the door with the key no longer prematurely completes the level; the player can pass through and must reach the `goal` to win.

## [0.18.1] - 2026-06-05

### Fixed

- **E2E test "places an entity on the canvas"**: Playwright's CDP-based mouse events (`mouse.move/down/up`) do not synchronize correctly with React's async state updates when switching tools before clicking the grid. Replaced with `page.evaluate` + native `dispatchEvent` calls, which execute synchronously within the same event loop tick and reliably trigger `handleMouseDown`/`handleMouseUp`.

## [0.18.0] - 2026-06-05

### Added

- **Asset Explorer**: new left sidebar panel listing assets by category (Ground, Spikes, Player, Enemies, Objects) with sprite previews and click selection. Categorized for easy navigation.
- **Editor camera system**: zoom (+/−/reset), pan with middle/right mouse button. Separate `cameraStore` with `zoom`, `panX`, `panY` state. `useEditorCamera` hook handling wheel, mousedown/move/up and contextmenu events.
- **Keyboard navigation in entity list**: ArrowUp/ArrowDown keys allow navigating between entities in InspectorPanel.
- **`features/` directory**: directory structure per AGENTS.md architecture (`features/editor/`, `features/runtime/`), prepared for future logic migration from `components/`.
- **Tests**: `layerStore.test.ts` (8 tests, covering visibility toggle, active layer, reset), `cameraStore.test.ts` (8 tests, covering zoom, pan, fitToMap, limits).

### Changed

- **EditorShell**: integrates AssetExplorer in the left sidebar. `handleDragEnd` assigns `activeLayer` when placing tiles via drag & drop.
- **LevelCanvas**: integrates `useEditorCamera` with CSS `scale()` and `translate()` transform on the grid container. Added zoom buttons in the canvas header. `getCellFromEvent` scales coordinates by `zoom` for clicks in empty space.
- **InspectorPanel**: entity list with `tabIndex={0}` and `onKeyDown` for keyboard navigation.
- **`types/level.test.ts`**: updated to use correct types (`spike-up` instead of `spike`), added tests for Layer system and new entity types.
- **`package.json`**: v0.17.0 → v0.18.0.

### Fixed

- `getCellFromEvent` in LevelCanvas: now scales rect coordinates by `zoom` when using the bounding rect position as fallback, avoiding misalignment when zoomed.
- `types/level.test.ts`: replaced obsolete `'spike'` type with `'spike-up'` to match the current union type.

## [0.17.0] - 2026-06-05

### Added

- New tiles: **brick** (solid brick, texture similar to ground but brown) and **platform** (solid platform with gray metallic texture).
- New entities: **checkpoint** (respawn point), **door** (requires key), **key** (collectible key to open the door).
- Entity properties editable in InspectorPanel. When selecting an entity (click on canvas or in the inspector list), its `Record<string, unknown>` properties are shown with editable fields and a "+" button to add new ones.
- Layer system (Layers 0-5): numbered button bar above the canvas to hide/show each layer. Double-click a layer button sets it as active. Layers filter which tiles render on the editor canvas.
- `layerStore` (Zustand) with `activeLayer` and `visibleLayers` state.
- SVG sprites: `brick.svg`, `platform.svg`, `checkpoint.svg`, `door.svg`, `key.svg`.
- Procedural textures in runtime for brick, platform, checkpoint, door, key.
- Checkpoint resets player position on death (if activated). If no checkpoint, shows Game Over.
- Key collectible: picked up on touch, shows key icon in runtime UI, allows opening the door.
- Door: if the player has the key, the door opens and completes the level; otherwise shows "Need a key!" message.
- Respawn on fall out of world: if checkpoint active, respawns there; if not, Game Over.

### Changed

- `types/level.ts`: Tile extended with optional `layer: Layer` property. Added `Layer`, `LAYERS`, `LAYER_NAMES`, `LAYER_VISIBLE_DEFAULT` types.
- `types/level.schema.ts`: tileSchema now accepts optional `layer` (0-5).
- `stores/editorStore.ts`: PaintAction.tile now includes `layer?: Layer`. `batchPaint` assigns layer when creating tiles. Added `updateEntityProperty` function.
- `components/editor/LevelCanvas.tsx`: tileMap filters by `visibleLayers`. Uses `activeLayer` when placing tiles. Added layer buttons in canvas header.
- `components/editor/InspectorPanel.tsx`: added "Entities" section with clickable list and property editor per selected entity.
- `components/editor/ToolPanel.tsx`: tileOptions includes `brick`, `platform`. entityOptions includes `checkpoint`, `door`, `key`.
- `components/runtime/GameRuntime.tsx`: RuntimeScene class extended with `hasKey`, `keyIcon`, `checkpointLayer`, `doorLayer`, `keyLayer`. New `update()` logic for checkpoint respawn. Methods `onCollectKey`, `onReachCheckpoint`, `onTryDoor`.
- `package.json`: v0.16.0 → v0.17.0.

## [0.16.0] - 2026-06-05

### Added

- "Hitboxes ON/OFF" button in the runtime toggles visibility of Phaser Arcade physics bodies (tile, entity and player hitboxes). When activated, calls `world.createDebugGraphic()` and `world.drawDebug = true`; when deactivated, clears the graphic and disables drawing.

### Fixed

- Rotated spike hitboxes offset by one cell: Phaser's `refreshBody()` incorrectly positions the static body when the sprite has `setAngle()` different from 0. Replaced with explicit `body.x` / `body.y` assignment using the calculated tile position.

### Changed

- `GameRuntime.tsx`: added `toggleDebugRef`, `showHitboxes` state and toggle button in the UI.
- `GameRuntime.tsx`: ground and spikes now position their body manually (`body.x = x - TILE_SIZE/2`) instead of calling `refreshBody()`.

## [0.15.1] - 2026-06-05

### Fixed

- Directional spike collision: the `processCallback` now compares the player's position against the edge where the triangle tip is (e.g. `pBody.bottom > sBody.bottom` for spike-down). The player only dies when reaching the spike tip, not when crossing the tile center. This allows traversing the spike from the safe side (flat base) without dying before reaching the tip.

### Changed

- `GameRuntime.tsx`: removed center-based direction detection. Each orientation now compares against the tip edge: `sBody.bottom` (spike-down), `sBody.top` (spike-up), `sBody.right` (spike-right), `sBody.left` (spike-left).

## [0.15.0] - 2026-06-05

### Added

- Four directional spike variants in the selection panel: `spike-up`, `spike-down`, `spike-left` and `spike-right`. Each displayed with the correct visual orientation (CSS rotation in ToolPanel and LevelCanvas, `setAngle()` in the Phaser runtime).
- Backward compatibility: the Zod schema automatically transforms `"spike"` to `"spike-up"` when loading old levels.

### Changed

- `TILE_REGISTRY` in `types/tile-definitions.ts`: replaced single `spike` entry with four directional entries (`spike-up`, `spike-down`, `spike-left`, `spike-right`).
- `ToolPanel.tsx`: the tile panel lists all 4 spikes with rotated sprites via CSS `transform: rotate()`.
- `LevelCanvas.tsx`: `GridCell` applies `transform: rotate()` to spikes according to their direction.
- `GameRuntime.tsx`: spikes are rotated with `setAngle()` based on direction defined in `SPIKE_ANGLE`.
- `types/level.ts`: `TileType` now includes `"spike-up" | "spike-down" | "spike-left" | "spike-right"` instead of just `"spike"`.
- Tests updated to reflect the new type names and panel labels.

## [0.14.0] - 2026-06-05

### Added

- Coin counter in the top-right corner of the runtime, with coin icon and updatable number on collection.

### Changed

- World gravity increased from 300 to 1800 for faster falling.
- Player jump velocity increased from -320 to -800 to maintain jump height.
- Player horizontal speed increased from 160 to 300.

## [0.13.0] - 2026-06-05

### Added

- Sound effects in the Phaser runtime: jump (ascending), coin (bright ding), damage/game over (low buzz) and level complete (ascending arpeggio). Sounds are generated via WAV synthesis and loaded in the scene preload.

### Changed

- `GameRuntime.tsx`: added `preload()` method to load audio, sound declarations (`soundJump`, `soundCoin`, `soundHit`, `soundGoal`) and `.play()` calls in `onCollectCoin`, `onHitSpike`, `onReachGoal` and on jump.
- Version bump: new backward-compatible minor feature.

## [0.12.2] - 2026-06-05

### Fixed

- Removed "GOAL" text from the goal sprite in both SVG and Phaser runtime.

## [0.12.1] - 2026-06-05

### Fixed

- Sprite images in `LevelCanvas.tsx` now fill the entire cell (`background-size: cover` instead of `contain`), removing empty borders around the sprite.
- Removed the "P" label that appeared above the player during game execution in `GameRuntime.tsx`.

## [0.12.0] - 2026-06-05

### Changed

- Replaced solid color rectangles in the Phaser runtime with programmatically drawn recognizable shapes: ground with brick texture, triangular spike, blue character, circular coin, enemy with eyes, and goal with flag.
- Removed the `RuntimeTexture` interface and generic texture creation loop. Each sprite is now drawn with Phaser Graphics primitives (`fillRect`, `fillCircle`, `fillTriangle`, `lineStyle`).
- `ToolPanel.tsx`: tile and entity previews now show SVG sprites from `public/sprites/` instead of solid color boxes with letters.

### Added

- SVG sprites in `public/sprites/` for each tile (`ground.svg`, `spike.svg`) and entity (`player.svg`, `coin.svg`, `enemy.svg`, `goal.svg`).

## [0.11.0] - 2026-06-05

### Changed

- Removed drag & drop of tiles and entities in `ToolPanel.tsx`. Each row is now a clickable `div` with `role="button"` that selects the element on click. Removed `useDraggable`, `DragHandle`, `setNodeRef` and the `@dnd-kit/core` dependency from the component.
- `ToolPanel.test.tsx`: simplified test wrapper (no longer requires `DndContext`), updated selected state selector to use `getByRole('button')`.

### Removed

- Drag functionality from the selection panel to the canvas. Selection is now exclusively via click.

## [0.10.0] - 2026-06-04

### Added

- `hooks/` and `lib/` directories with initial structure per AGENTS.md convention.
- `hooks/useTileBrush.ts`: hook to encapsulate paint logic with batch and RAF.
- `lib/utils.ts`: shared utilities (`makeId`, `clamp`, `isKeyOf`).
- `types/tile-definitions.ts`: tile data model with `id`, `name`, `category`, `sprite` and `solid` per AGENTS.md specification.
- Entity `properties: Record<string, unknown>` for dynamic per-entity data.

### Changed

- `types/level.ts`: Entity now uses `position: { x, y }` instead of flat `x`, `y`, aligned with the interface defined in AGENTS.md.
- `types/level.schema.ts`: updated Zod schema for nested `position` and optional `properties` with transform to empty object.
- `stores/editorStore.ts`: updated references to `entity.position.x`/`entity.position.y`.
- `components/editor/LevelCanvas.tsx`: updated references to `entity.position`.
- `components/runtime/GameRuntime.tsx`: updated references to `entity.position`.
- All tests updated for the new Entity interface.

## [0.9.2] - 2026-06-04

### Added

- Lighthouse exceptions documentation in `docs/lighthouse-exceptions.md`.
- Full Lighthouse audit on desktop, tablet and mobile using Edge (Chromium v148).

### Changed

- `ToolPanel.tsx`: headings `<h3>` → `<h2>` for correct hierarchy (heading-order).
- `ToolPanel.tsx`: `text-slate-500` → `text-slate-300` on 10px descriptions for sufficient contrast (color-contrast).
- `ToolPanel.tsx`: `aria-label` added to drag handles and selection buttons (aria-command-name).
- `EditorShell.tsx`: `aria-label` on Play/Stop now includes visible text (label-content-name-mismatch).
- `InspectorPanel.tsx`: `aria-label` updated to match visible text.
- `GameRuntime.tsx`: `aria-label` added to the Stop button.
- `text-[10px]` → `text-[0.625rem]` and `text-[5px]` → `text-[0.3125rem]` for relative font sizes.

### Fixed

- Insufficient color contrast on `text-[10px] text-slate-500` over dark background (2.17:1 → 6.81:1).

## [0.9.1] - 2026-06-04

### Added

- Zod schema for LevelData validation in `types/level.schema.ts` (A03).
- Integration tests for invalid JSON rejection in InspectorPanel.
- OWASP security documentation in `docs/owasp-security.md`.

### Changed

- `InspectorPanel.handleLoad` now uses `levelDataSchema.safeParse()` instead of `JSON.parse` + manual casting.
- Error logging silenced in `handleLoad` (A09).

### Security

- Strict type validation with Zod for all level JSON input (A03).
- Removed user data exposure in `console.error` (A09).
- Ran `npm audit` (A06): 2 moderate vulnerabilities in postcss (transitive from Next.js).

## [0.9.0] - 2026-06-04

### Added

- Testing stack: Vitest (unit), Testing Library (integration), Playwright (E2E).
- `vitest.config.ts` with jsdom, React plugin and `@/` alias.
- `playwright.config.ts` with tests in `e2e/`, automatic Next.js server.
- `test`, `test:run` and `test:e2e` scripts in `package.json`.
- `eslint.config.mjs` ignores `e2e/` and `*.test.{ts,tsx}`.

## [0.8.1] - 2026-06-03

### Added

- Death on void fall in the runtime. Removed `setCollideWorldBounds(true)` from the player. In `update()`, if `player.y > worldHeight + 64` triggers `onHitSpike()` (Game Over + pause).

## [0.8.0] - 2026-06-03

### Changed

- Unified selection in `selectionStore`: `selectedTile` and `selectedEntity` are now mutually exclusive. Selecting a tile clears `selectedEntity` and activates `"tile"` mode. Selecting an entity clears `selectedTile` and activates `"entity"` mode. Types changed to `TileType | null` and `EntityType | null`.
- `ToolPanel.tsx`: `TileRow` and `EntityRow` no longer call `setActiveTool` manually; the store handles it. Entity highlight no longer depends on `activeTool`.

### Added

- `makeAction` in `LevelCanvas.tsx` returns `null` if no tile or entity is selected, preventing invalid paint actions.

## [0.7.5] - 2026-06-03

### Changed

- Removed "Tile brush" and "Entity" buttons from the tool panel in `ToolPanel.tsx`. The mode is now implicitly selected by clicking a tile or entity row. Only the "Erase" button is kept as an explicit tool.
- `TileRow` now also calls `setActiveTool("tile")` on click.

## [0.7.4] - 2026-06-03

### Fixed

- Selection buttons in `ToolPanel.tsx` did not work because `useDraggable` consumed the click event. Separated the drag activator (visual preview) from the `onClick` selection (label). `listeners` only on `DragHandle`, `onClick` on a separate `<button>`.

## [0.7.3] - 2026-06-03

### Changed

- Removed independent "Drag" buttons in `ToolPanel.tsx`. The full row of each tile/entity is now both selectable and draggable via `useDraggable`, with a single `<button>` handling both actions.

## [0.7.2] - 2026-06-03

### Fixed

- Nested `button` in `ToolPanel.tsx`: `DraggableItem` rendered a `<button>` inside another `<button>` (selectable row), which is invalid HTML and caused a hydration error. Changed to `<div>` with `cursor-grab`.

## [0.7.1] - 2026-06-03

### Fixed

- Hydration mismatch in `ToolPanel` caused by `useDraggable` (dnd-kit) generating attributes with different IDs between server and client. Changed direct import to `next/dynamic` with `ssr: false` in `EditorShell.tsx`.

## [0.7.0] - 2026-06-03

### Changed

- Redesigned `ToolPanel` with visual previews: each tile and entity shows a colored square (same colors as canvas and runtime), readable Spanish name, technical type and a drag button with its own thumbnail. Active selection is visually highlighted.

## [0.6.1] - 2026-06-03

### Changed

- Enemy patrol: removed the 2-second timer fallback. Enemies now reverse direction **only** when `body.blocked.left` or `body.blocked.right` is set by a tile or world-bound collision. The timer was interfering with wall-collision detection (enemies reversed before reaching walls in open areas).

## [0.6.0] - 2026-06-03

### Added

- Enemy patrol behaviour in the game runtime. Enemies move horizontally (initial velocity `80px/s`) and reverse direction when colliding with solid tiles or world bounds via `body.blocked.left` / `body.blocked.right` detection.
- Enemy movement runs before the `if (!this.player) return` guard, so enemies patrol even without a player entity.

### Changed

- Removed `bounceX: 1` from enemies (both group config and individual body). Wall collisions are now handled manually in `update()` to avoid double-reversal bugs with Phaser's automatic bounce.

## [0.5.0] - 2026-06-03

### Changed

- Replaced full 64×64 DOM grid (4096 `<button>` elements) with virtual rendering: only cells containing tiles, entities, or the selected entity generate DOM nodes. Empty cells render as a CSS `background-image` grid pattern (linear-gradient). Cells positioned with `position: absolute` instead of CSS Grid.
- `getCellFromEvent` now calculates coordinates from mouse position against `getBoundingClientRect()` of the grid when not clicking on an existing button, allowing interaction with empty cells without DOM elements.
- Removed `useDroppable` from all 4096 individual `GridCell` components. Replaced with a single `useDroppable` on the grid container. Drag-and-drop now calculates the target cell from pointer coordinates (`activatorEvent + delta`) in `EditorShell`.

### Added

- Paint-by-drag: holding left mouse button and dragging paints tiles/entities/erase continuously.
- Batch painting via `batchPaint` action in `editorStore` that applies multiple paint actions in a single state update. Paint changes accumulate during drag and flush via `requestAnimationFrame` (at most once per frame).

### Performance

- ~99% DOM node reduction on empty level (from 4096 to ~0).
- Removed 4096 `useDroppable` calls (dnd-kit registration).
- Paint updates are batched into a single state update per frame.

## [0.4.0] - 2026-06-03

### Changed

- Changed default level grid from 16×12 to 64×64 cells.
- Reduced editor cell size from 40px to 10px so the 64×64 grid occupies the same visual canvas area (~640×640px).
- Increased Phaser runtime canvas limits from 1024×768 to 1280×720 for a wider viewport.
- Changed runtime container height from fixed `h-96` (384px) to `min-h-[480px]`.
- Updated grid dimension badge in LevelCanvas to show dynamic `{width}x{height}` instead of hardcoded "32x32".
- Reduced entity symbol text and selection ring size to match the smaller cells.
- Optimized `LevelCanvas` rendering performance: wrapped `GridCell` in `React.memo` to prevent re-rendering of unchanged cells, replaced inline `onClick` closures with event delegation via `data-x`/`data-y` attributes, moved grid cell generation into a `useMemo`, and switched from full-store subscriptions to granular Zustand selectors.
- Added paint-by-drag: holding left mouse button and dragging paints tiles/entities/erase continuously.
- Added batch painting via `batchPaint` action in `editorStore` that applies multiple paint actions in a single state update, then accumulates paint changes during drag and flushes via `requestAnimationFrame` (at most once per frame).
- Removed `useDroppable` from all 4096 individual `GridCell` components (the previous performance bottleneck). Replaced with a single `useDroppable` on the grid container. Drag-and-drop now calculates the target cell from pointer coordinates (`activatorEvent + delta`) instead of per-cell droppable IDs.
- Replaced full 64×64 DOM grid (4096 `<button>` elements always rendered) with virtual rendering: only cells containing tiles, entities, or the selected entity generate DOM nodes. Empty cells are rendered as a CSS `background-image` grid pattern instead. GridCells use `position: absolute` for layout. The `getCellFromEvent` fallback calculates cell coordinates from mouse position when clicking on empty areas. This reduces DOM nodes by ~99% on initial load.

## [0.3.0] - 2026-06-03

### Added

- Entity selection on the canvas: clicking an entity selects it (cyan ring indicator).
- Entity deletion via the erase tool: clicking a cell with the erase tool now removes both tiles and entities.
- Entity deletion via keyboard: pressing Delete or Backspace removes the currently selected entity.
- `selectedEntityId` state in `selectionStore` to track which entity is selected on the canvas.

## [0.2.2] - 2026-06-03

### Fixed

- Fixed Phaser runtime physics body alignment by replacing scaled 1px debug textures with runtime textures generated at their real collision sizes.
- Fixed player body sizing by using explicit runtime constants and centering the Arcade Physics body on the player sprite.

### Changed

- Runtime objects now use dedicated generated textures for ground, spikes, player, coins, goal, and enemies instead of relying on `setDisplaySize` for physics objects.

## [0.2.1] - 2026-06-03

### Fixed

- Fixed Phaser runtime collisions between the player and ground tiles by creating ground and spike tiles as static Arcade Physics bodies and refreshing their bodies after display sizing.
- Fixed static overlap bodies for coins and goals after display sizing.

### Changed

- Tightened Phaser runtime typing for dynamic imports and Arcade Physics overlap callbacks without using `any`.

## [0.2.0] - 2026-06-02

### Added

- Level editor UI with tile and entity placement.
- Grid-based painting system for 32x32 tiles.
- Support for Player, Coin, Enemy, Spike, Goal, and Ground.
- JSON export/load support for levels.
- Phaser 3 runtime that consumes level JSON and runs arcade physics.
- Zustand stores for editor state, project JSON, selection state, and runtime mode.
- Dnd-kit drag-and-drop integration for placing tiles and entities.

### Changed

- Updated application metadata and global styling for GameForge.
