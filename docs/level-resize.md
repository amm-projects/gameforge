# Level Size Increase

## [0.10.0] - 2026-06-03

### Changed

- Default level size: **16×12 → 64×64** cells.
- `resetLevel` creates a 64×64 level.
- Editor cell size: **40px → 10px** to maintain visual canvas area (~640×640px).
- Phaser runtime viewport: **1024×768 → 1280×720**.
- Runtime container: `h-96` → `min-h-[480px]`.

### Files modified

- `stores/editorStore.ts` — Default `width`/`height` and `resetLevel`.
- `components/editor/LevelCanvas.tsx` — Cell `h-10 w-10` → `h-[10px] w-[10px]`, grid `* 40` → `* 10`.
- `components/runtime/GameRuntime.tsx` — Canvas limits and container height.
