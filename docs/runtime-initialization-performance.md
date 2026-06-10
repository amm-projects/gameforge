# Runtime Initialization Performance

## [0.39.2] - 2026-06-10

### Fixed

- **Page scroll lag during runtime**: editor panels (`ToolPanel`, `LevelCanvas` with dnd-kit grid, `InspectorPanel`) were still rendered below the Phaser canvas during play. The browser had to composite both a heavy canvas and thousands of dnd-kit grid cells on every scroll, causing lag.
  - Wrapped `DndContext` + editor panels in `{!isPlaying && (...)}` so they unmount completely when playing.
  - Lock `document.body.style.overflow = "hidden"` during runtime to prevent accidental page scroll.
  - File: `src/components/EditorShell.tsx`

- **Canvas initialization delay**: `await import("phaser")` (~1MB+ JS) only started downloading when the user clicked Play, adding a multi-second delay before the game appeared.
  - Created `src/lib/phaser.ts` with a cached `preloadPhaser()` promise.
  - EditorShell calls `preloadPhaser()` in a `useEffect` on mount, starting the download immediately.
  - GameRuntime calls `preloadPhaser()` instead of `await import("phaser")` — subsequent plays resolve instantly from cache.

- **Slow Canvas renderer**: used `PhaserLib.CANVAS` (software rendering, CPU-only).
  - Switched to `PhaserLib.AUTO` — uses WebGL (GPU-accelerated) when available, falls back to Canvas otherwise. Drastically faster initialization and rendering.

- **Camera centering delay**: camera started at (0,0) and slid to the player position over ~0.5s because `startFollow` uses lerp 0.08.
  - Added `this.cameras.main.centerOn(this.player.x, this.player.y)` before `startFollow()` so the camera snaps to the player instantly.

- **Canvas height overshoot on init**: container div had `min-h-[480px]`, making it taller than the actual game canvas. During WebGL initialization the canvas slowly adjusted to its correct size.
  - Moved `canvasWidth`/`canvasHeight` computation to component body.
  - Replaced `min-h-[480px]` with `style={{ height: canvasHeight }}` so the container is exactly the game height from the first render.

- **Smooth scroll delay on Play**: `scrollIntoView({ behavior: "smooth" })` took ~0.5s to bring the runtime section into view.
  - Changed to `scrollIntoView({ block: "center" })` (instant scroll, vertically centered).

### Changed

- `src/lib/phaser.ts`: new preloader module.
- `src/components/runtime/GameRuntime.tsx`: preloadPhaser(), AUTO renderer, exact container height.
- `src/components/EditorShell.tsx`: hide editor panels during play, body overflow lock, preload Phaser on mount, instant centered scroll.
- `src/engine/runtime/RuntimeScene.ts`: camera instant centerOn before startFollow.
