"use client";

import { useEditorStore } from "@/stores/editorStore";
import { sampleLevels } from "@/data/sampleLevels";

export function SampleLevels() {
  const loadLevel = useEditorStore((s) => s.loadLevel);

  return (
    <aside className="rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <h2 className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Sample Levels
      </h2>
      <div className="flex flex-col gap-1.5">
        {sampleLevels.map((sl) => (
          <button
            key={sl.id}
            type="button"
            onClick={() => loadLevel(sl.level)}
            aria-label={`Load level: ${sl.name}`}
            className="w-full rounded-xl bg-slate-900 px-3 py-2 text-left transition hover:bg-slate-800"
          >
            <span className="block text-xs font-medium text-slate-200">{sl.name}</span>
            <span className="block text-[0.625rem] text-slate-500">{sl.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
