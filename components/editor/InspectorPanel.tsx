"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { levelDataSchema } from "@/types/level.schema";

export function InspectorPanel() {
  const { tiles, entities, width, height, loadLevel, resetLevel } = useEditorStore();
  const { jsonText, setJsonText } = useProjectStore();
  const { setIsPlaying } = useRuntimeStore();

  const levelData = useMemo(
    () => ({ width, height, tiles, entities }),
    [width, height, tiles, entities]
  );

  const handleSave = () => {
    setJsonText(JSON.stringify(levelData, null, 2));
  };

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const result = levelDataSchema.safeParse(parsed);
      if (!result.success) {
        return;
      }
      loadLevel(result.data);
    } catch {
      return;
    }
  };

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Inspector</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>Dimensiones: {width} × {height}</p>
          <p>Tiles: {tiles.length}</p>
          <p>Entidades: {entities.length}</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-slate-800/80 bg-slate-900 p-4">
        <button
          type="button"
          onClick={handleSave}
          aria-label="Exportar JSON"
          className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          Exportar JSON
        </button>
        <button
          type="button"
          onClick={handleLoad}
          aria-label="Cargar JSON"
          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
        >
          Cargar JSON
        </button>
        <button
          type="button"
          onClick={() => {
            resetLevel();
            setIsPlaying(false);
          }}
          aria-label="Limpiar nivel"
          className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
        >
          Limpiar nivel
        </button>
      </div>

      <textarea
        value={jsonText}
        onChange={(event) => setJsonText(event.target.value)}
        aria-label="Editor de JSON del nivel"
        className="h-72 w-full resize-none rounded-3xl border border-slate-800/80 bg-slate-950 p-3 text-xs text-slate-200 outline-none focus:border-amber-500"
        placeholder="JSON del nivel aquí..."
      />
    </aside>
  );
}
