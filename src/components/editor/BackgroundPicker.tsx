"use client";

import type { BackgroundTheme } from "@/types/level";
import { BACKGROUND_COLORS } from "@/types/level";
import { useT } from "@/hooks/useTranslate";

export function BackgroundPicker({
  background,
  setBackground,
}: {
  background: BackgroundTheme;
  setBackground: (theme: BackgroundTheme) => void;
}) {
  const t = useT();

  const BACKGROUND_LABEL_KEY: Record<BackgroundTheme, string> = {
    dark: "background.dark",
    sky: "background.sky",
    forest: "background.forest",
    desert: "background.desert",
    sunset: "background.sunset",
    purple: "background.purple",
  };

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{t("background.title")}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(BACKGROUND_COLORS) as BackgroundTheme[]).map((key) => {
          const label = t(BACKGROUND_LABEL_KEY[key]);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setBackground(key)}
              aria-label={t("background.setAria", { label })}
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
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
