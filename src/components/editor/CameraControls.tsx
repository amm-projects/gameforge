"use client";

import { useT } from "@/hooks/useTranslate";

export function CameraControls({
  zoom,
  zoomIn,
  zoomOut,
  resetZoom,
}: {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}) {
  const t = useT();
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={zoomOut}
        aria-label={t("camera.zoomOutAria")}
        className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 transition hover:bg-slate-700"
      >
        −
      </button>
      <span className="w-8 text-center text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        onClick={zoomIn}
        aria-label={t("camera.zoomInAria")}
        className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 transition hover:bg-slate-700"
      >
        +
      </button>
      <button
        type="button"
        onClick={resetZoom}
        aria-label={t("camera.resetZoomAria")}
        className="rounded-md bg-slate-800 px-2 py-0.5 text-[0.625rem] text-slate-400 transition hover:bg-slate-700"
      >
        ⊞
      </button>
    </div>
  );
}
