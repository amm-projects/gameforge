# Sample Levels Panel

## [0.36.0] - 2026-06-09

### Added

- **Sample Levels panel** (`src/components/editor/SampleLevels.tsx`): new UI section below the ToolPanel in the editor's left sidebar. Displays a list of pre-made levels; clicking a button loads the entire level into the editor via `editorStore.loadLevel()`.
- **Sample levels data** (`src/data/sampleLevels.ts`): defines ten levels:
  - `Empty` — blank 64x64 canvas, no tiles or entities.
  - `First Steps` — 30x20 sky-level with a single ground row, a platform, player, and goal.
  - `Coin Run` — 40x20 forest-level with three brick platform groups, coins on each, and two enemies on the ground.
  - `Danger Pass` — 30x20 desert-level with spike clusters, platforms to jump over them, three enemies, and coins.
  - `Sky Fortress` — 40x30 sunset-level with ascending platforms forming a staircase, enemies at each level, and the goal at the top-right.
  - `Underground` — 40x15 purple-level with brick ceiling sections, low tunnels, mid-height platforms, floor spikes, and tight corridors.
  - `Speed Run` — 50x15 desert-level with a flat ground, brick obstacles to jump over, floor spikes, and five enemies spread across the run.
  - `Treasure Tower` — 20x40 forest-level with alternating left/right platforms, a vertical climb, and coins on every platform.
  - `Bridge of Spikes` — 35x20 dark-level with ground only at the edges, a spike pit covering most of the floor, and staggered platforms forming a bridge across.
  - `Vertical Descent` — 15x45 sky-level with a narrow shaft, platforms on both sides, spikes on some lower platforms, and enemies at multiple levels.

### Architecture

- `SampleLevels.tsx` is a client component that reads `sampleLevels` from the data module and renders a button per entry. Each button calls `useEditorStore.getState().loadLevel()` with the corresponding `LevelData` object.
- `src/data/sampleLevels.ts` exports `SampleLevel[]` where each entry has `id`, `name`, `description`, and a `LevelData` object. Entity IDs are generated with `makeId()` to avoid collisions.
- Helper functions `groundRow()`, `coinAt()`, `enemyAt()`, `spikeAt()` keep the level definitions concise and readable.

### Tests

- `src/components/editor/SampleLevels.test.tsx`: 6 tests covering title rendering, all button presence, name/description display, load on click, tiles/entities validation, and empty level loading. All tests reference `sampleLevels` by index and pass regardless of how many levels are defined.
