# Full Responsive Layout

## [0.56.3] - 2026-06-14

### Changed

- **Header** (`EditorShell.tsx`): Padding reduced on mobile (`px-4 py-3` → `sm:px-6 sm:py-4`). Brand text size scales (`text-[0.5rem]` → `sm:text-xs`). Title scales (`text-xl` → `sm:text-2xl` → `lg:text-3xl`). Button sizes and gaps reduced on mobile.

- **Main layout** (`EditorShell.tsx`): Sidebar widths changed from fixed `max-w-sm lg:w-[320px]` / `max-w-lg lg:w-[420px]` to flexible `lg:w-[280px] xl:w-[320px]` / `lg:w-[300px] xl:w-[360px]` with `shrink-0` to prevent overflow. Removed `min-h-[calc(100vh-104px)]` from the flex container and `min-h-[300px]`/`min-h-[400px]` from children. Padding reduced on mobile (`p-3` → `sm:p-4` → `lg:p-6`). Added `min-w-0` to the center column to allow flex shrink.

- **ToolPanel** (`ToolPanel.tsx`): Tile and entity grids changed from `grid-cols-4` to `grid-cols-3 sm:grid-cols-4` to fit on narrow viewports. Panel padding: `p-3 sm:p-4`.

- **SampleLevels** (`SampleLevels.tsx`): Button grid changed from `grid-cols-2` to `grid-cols-1 sm:grid-cols-2`. Panel padding: `p-3 sm:p-4`.

- **LevelCanvas** (`LevelCanvas.tsx`): Header now stacks vertically on mobile (`flex-col gap-2` → `sm:flex-row`). Title/description font sizes scale down (`text-sm` → `sm:text-base`). Grid container changed from `overflow-hidden` to `overflow-auto` so the level scrolls when the viewport is smaller. Section padding: `p-3 sm:p-4`.

- **InspectorPanel** (`InspectorPanel.tsx`): JSON textarea height reduced on mobile (`h-48` → `sm:h-72`). Panel padding: `p-3 sm:p-4`.

- **GameRuntime** (`GameRuntime.tsx`): Canvas container now uses `aspectRatio: "16 / 9"` with `maxHeight: "calc(100vh - 210px)"` instead of `flex-1`. This keeps the canvas proportional and prevents it from dominating the viewport. Section capped at `max-w-5xl` to avoid excessive width on large screens. Phaser `Scale.FIT` (1280×720 base) scales the canvas within this constrained container while keeping HUD positions correct.

- **EditorShell** (`EditorShell.tsx`): Runtime wrapper changed from `flex-1 flex flex-col min-h-0` to a normal block `<div>`. The `<main>` element changed from `flex flex-col` to `min-h-screen` block layout, ensuring both headers (GameForge bar + runtime header) are always visible in normal document flow.

### Motivation

All components used fixed dimensions and single breakpoints that caused horizontal overflow, cramped layouts, or excessive whitespace on phones and tablets. Following AGENTS.md Lighthouse requirements and responsive design rules, every element now scales via Tailwind breakpoints (`sm:`, `lg:`, `xl:`) with appropriate fallbacks.
