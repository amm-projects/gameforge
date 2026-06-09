# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - xxxx-xx-xx

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
