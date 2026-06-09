"use client";

export function CameraControls({
  zoom,
  zoomIn,
  zoomOut,
  resetZoom,
  onFitToMap,
}: {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  onFitToMap?: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={zoomOut}
        aria-label="Zoom out"
        className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 transition hover:bg-slate-700"
      >
        −
      </button>
      <span className="w-8 text-center text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        onClick={zoomIn}
        aria-label="Zoom in"
        className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 transition hover:bg-slate-700"
      >
        +
      </button>
      <button
        type="button"
        onClick={resetZoom}
        aria-label="Reset zoom"
        className="rounded-md bg-slate-800 px-2 py-0.5 text-[0.625rem] text-slate-400 transition hover:bg-slate-700"
      >
        ⊞
      </button>
      {onFitToMap && (
        <button
          type="button"
          onClick={onFitToMap}
          aria-label="Fit map to viewport"
          className="rounded-md bg-slate-800 px-2 py-0.5 text-[0.625rem] text-slate-400 transition hover:bg-slate-700"
        >
          ⊡
        </button>
      )}
    </div>
  );
}
