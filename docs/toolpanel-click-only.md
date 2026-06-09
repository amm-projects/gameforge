# ToolPanel: click-only selection

## [0.11.0] - 2026-06-05

### Changed

- Removed drag & drop from the element selection panel.
- Each tile/entity row is now a `div` with `role="button"`, `tabIndex={0}` and `onClick`.
- Removed `useDraggable` from `TileRow` and `EntityRow`.
- Removed `DragHandle` component.
- Visual preview remains unchanged.
- `ToolPanel.test.tsx` no longer needs `DndContext` as a wrapper.

### Motivation

Each row supported both click and drag, duplicating interaction and adding complexity (`useDraggable`, `DragHandle`, `isDragging` state) without significant value over the main flow: click to select and paint on the canvas.
