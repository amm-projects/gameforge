# Grid Dimension Badge Removed

## [0.35.1] - 2026-06-09

### Removed

- `{width}x{height} grid` badge (e.g. "64x64 grid") removed from `LevelCanvas` header.
- Corresponding test `'shows grid dimensions badge'` removed from `LevelCanvas.test.tsx`.

### Reason

The badge displayed redundant information: level dimensions are editable from the inspector and do not need a constant visual indicator in the canvas toolbar. Its removal simplifies the header and avoids distraction during editing.

### Files modified

- `src/components/editor/LevelCanvas.tsx`
- `src/components/editor/LevelCanvas.test.tsx`
