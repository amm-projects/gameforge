"use client";

import type { BackgroundTheme } from "@/types/level";
import { BACKGROUND_COLORS, BACKGROUND_LABELS } from "@/types/level";

export function BackgroundPicker({
  background,
  setBackground,
}: {
  background: BackgroundTheme;
  setBackground: (theme: BackgroundTheme) => void;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Background</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(BACKGROUND_COLORS) as BackgroundTheme[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setBackground(key)}
            aria-label={`Set background to ${BACKGROUND_LABELS[key]}`}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.625rem] font-medium transition ${
              background === key
                ? "bg-amber-500/20 ring-1 ring-amber-500/50 text-amber-300"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <span
              className="inline-block h-3 w-3 rounded-full ring-1 ring-slate-700/50"
              style={{ backgroundColor: BACKGROUND_COLORS[key] }}
            />
            {BACKGROUND_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}
