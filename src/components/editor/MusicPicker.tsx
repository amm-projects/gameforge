"use client";

import type { MusicTheme } from "@/types/level";
import { MUSIC_THEMES } from "@/types/level";
import { useT } from "@/hooks/useTranslate";

const MUSIC_ICONS: Record<MusicTheme, string> = {
  calm: "♩",
  adventure: "♪",
  retro: "♫",
  mystery: "♬",
  boss: "𝄞",
};

const MUSIC_COLORS: Record<MusicTheme, string> = {
  calm: "#60a5fa",
  adventure: "#fbbf24",
  retro: "#34d399",
  mystery: "#a78bfa",
  boss: "#f87171",
};

const MUSIC_LABEL_KEY: Record<MusicTheme, string> = {
  calm: "music.calm",
  adventure: "music.adventure",
  retro: "music.retro",
  mystery: "music.mystery",
  boss: "music.boss",
};

export function MusicPicker({
  music,
  setMusic,
}: {
  music: MusicTheme;
  setMusic: (theme: MusicTheme) => void;
}) {
  const t = useT();

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{t("music.title")}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {(Object.keys(MUSIC_THEMES) as MusicTheme[]).map((key) => {
          const label = t(MUSIC_LABEL_KEY[key]);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMusic(key)}
              aria-label={t("music.setAria", { label })}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.625rem] font-medium transition ${
                music === key
                  ? "bg-amber-500/20 ring-1 ring-amber-500/50 text-amber-300"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ring-1 ring-slate-700/50"
                style={{ backgroundColor: MUSIC_COLORS[key], color: "#000" }}
              >
                {MUSIC_ICONS[key]}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
