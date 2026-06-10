"use client";

import { useMemo } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { levelDataSchema } from "@/types/level.schema";
import { useSelectionStore } from "@/stores/selectionStore";
import { useT } from "@/hooks/useTranslate";
import { BackgroundPicker } from "@/components/editor/BackgroundPicker";
import { EntityProperties } from "@/components/editor/EntityProperties";
import { EditTargetInspector } from "@/components/editor/EditTargetInspector";

export function InspectorPanel() {
  const t = useT();
  const { tiles, entities, width, height, loadLevel, resetLevel, updateEntityProperty, updateTileSolid, updateTileProperty } = useEditorStore();
  const { jsonText, setJsonText } = useProjectStore();
  const { setIsPlaying } = useRuntimeStore();
  const background = useEditorStore((s) => s.background);
  const setBackground = useEditorStore((s) => s.setBackground);
  const { selectedEntityId, selectedEditTarget, setSelectedEditTarget } = useSelectionStore();

  const levelData = useMemo(
    () => ({ width, height, tiles, entities }),
    [width, height, tiles, entities]
  );

  const selectedEntity = useMemo(
    () => entities.find((e) => e.id === selectedEntityId) ?? null,
    [entities, selectedEntityId]
  );

  const handleSave = () => {
    setJsonText(JSON.stringify(levelData, null, 2));
  };

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const result = levelDataSchema.safeParse(parsed);
      if (!result.success) return;
      loadLevel(result.data);
    } catch {
      return;
    }
  };

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{t("inspector.title")}</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <p>{t("inspector.dimensions", { width, height })}</p>
          <p>{t("inspector.tileCount", { count: tiles.length })}</p>
          <p>{t("inspector.entityCount", { count: entities.length })}</p>
        </div>
      </div>

      <BackgroundPicker background={background ?? "dark"} setBackground={setBackground} />

      {selectedEntity && (
        <EntityProperties entity={selectedEntity} updateEntityProperty={updateEntityProperty} />
      )}

      {selectedEditTarget && (
        <EditTargetInspector
          editTarget={selectedEditTarget}
          tiles={tiles}
          updateTileSolid={updateTileSolid}
          updateTileProperty={updateTileProperty}
          setSelectedEditTarget={setSelectedEditTarget}
        />
      )}

      <div className="grid gap-3 rounded-3xl border border-slate-800/80 bg-slate-900 p-4">
        <button
          type="button"
          onClick={handleSave}
          aria-label={t("inspector.exportJson")}
          className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          {t("inspector.exportJson")}
        </button>
        <button
          type="button"
          onClick={handleLoad}
          aria-label={t("inspector.loadJson")}
          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
        >
          {t("inspector.loadJson")}
        </button>
        <button
          type="button"
          onClick={() => {
            resetLevel();
            setIsPlaying(false);
          }}
          aria-label={t("inspector.clearLevel")}
          className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
        >
          {t("inspector.clearLevel")}
        </button>
      </div>

      <textarea
        value={jsonText}
        onChange={(event) => setJsonText(event.target.value)}
        aria-label={t("inspector.jsonEditorAria")}
        className="h-72 w-full resize-none rounded-3xl border border-slate-800/80 bg-slate-950 p-3 text-xs text-slate-200 outline-none focus:border-amber-500"
        placeholder={t("inspector.jsonPlaceholder")}
      />
    </aside>
  );
}
