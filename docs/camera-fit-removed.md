# "Fit map to viewport" button removed

## [0.35.1] - 2026-06-09

### Removed

- "Fit map to viewport" button (`⊡`) removed from `CameraControls`.
- `onFitToMap` prop removed from `CameraControls`.
- `handleFitToMap` function removed from `LevelCanvas`.
- `fitToMap` function removed from the `useEditorCamera` return value (still available directly from `useCameraStore` if needed in the future).
- `onFitToMap` tests removed from `CameraControls.test.tsx`.
- `fitToMap` assertion removed from `useEditorCamera.test.ts`.

### Reason

Removed for MVP simplicity. The functionality remains implemented in `cameraStore.fitToMap` and can be reintroduced as a future feature if needed.

### Files modified

- `src/components/editor/CameraControls.tsx`
- `src/components/editor/CameraControls.test.tsx`
- `src/components/editor/LevelCanvas.tsx`
- `src/hooks/useEditorCamera.ts`
- `src/hooks/useEditorCamera.test.ts`
