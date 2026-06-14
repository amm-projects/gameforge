"use client";

import { useEditorStore } from "@/stores/editorStore";
import { sampleLevels } from "@/data/sampleLevels";
import { useT } from "@/hooks/useTranslate";

export function SampleLevels() {
  const t = useT();
  const loadLevel = useEditorStore((s) => s.loadLevel);

  return (
    <aside className="rounded-3xl border border-slate-800/80 bg-slate-950/95 p-3 shadow-xl shadow-slate-950/10 sm:p-4">
      <h2 className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {t("sampleLevels.title")}
      </h2>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {sampleLevels.map((sl) => {
          const name = t(`sampleLevel.${sl.id}.name`);
          const description = t(`sampleLevel.${sl.id}.description`);
          return (
            <button
              key={sl.id}
              type="button"
              onClick={() => loadLevel(sl.level)}
              aria-label={t("sampleLevels.loadAria", { name })}
              className="w-full rounded-xl bg-slate-900 px-3 py-2 text-left transition hover:bg-slate-800"
            >
              <span className="block text-xs font-medium text-slate-200">{name}</span>
              <span className="block text-[0.625rem] text-slate-500">{description}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
