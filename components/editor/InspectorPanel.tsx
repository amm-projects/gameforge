"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { useProjectStore } from "@/stores/projectStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { levelDataSchema } from "@/types/level.schema";
import { useSelectionStore } from "@/stores/selectionStore";

export function InspectorPanel() {
  const { tiles, entities, width, height, loadLevel, resetLevel, updateEntityProperty } = useEditorStore();
  const { jsonText, setJsonText } = useProjectStore();
  const { setIsPlaying } = useRuntimeStore();
  const { selectedEntityId, setSelectedEntityId } = useSelectionStore();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const entityListRef = useRef<HTMLDivElement | null>(null);

  const levelData = useMemo(
    () => ({ width, height, tiles, entities }),
    [width, height, tiles, entities]
  );

  const selectedEntity = useMemo(
    () => entities.find((e) => e.id === selectedEntityId) ?? null,
    [entities, selectedEntityId]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (entities.length === 0) return;
      const idx = entities.findIndex((e) => e.id === selectedEntityId);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (idx + 1) % entities.length;
        setSelectedEntityId(entities[next].id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + entities.length) % entities.length;
        setSelectedEntityId(entities[prev].id);
      }
    },
    [entities, selectedEntityId, setSelectedEntityId]
  );

  const handleAddProperty = () => {
    if (!selectedEntityId || !newKey.trim()) return;
    updateEntityProperty(selectedEntityId, newKey.trim(), newValue);
    setNewKey("");
    setNewValue("");
  };

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

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Entities</h3>
        <div className="max-h-40 space-y-1 overflow-y-auto" ref={entityListRef} tabIndex={0} onKeyDown={handleKeyDown}>
          {entities.length === 0 && (
            <p className="text-xs text-slate-600">No entities</p>
          )}
          {entities.map((entity) => (
            <button
              key={entity.id}
              type="button"
              onClick={() =>
                setSelectedEntityId(
                  selectedEntityId === entity.id ? null : entity.id
                )
              }
              aria-label={`Select ${entity.type} entity`}
              className={`w-full rounded-xl px-3 py-1.5 text-left text-xs transition ${
                selectedEntityId === entity.id
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {entity.type} ({entity.position.x}, {entity.position.y})
            </button>
          ))}
        </div>
      </div>

      {selectedEntity && (
        <div className="space-y-2 rounded-2xl border border-slate-800/80 bg-slate-900 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {selectedEntity.type} Properties
          </h3>
          {Object.keys(selectedEntity.properties).length === 0 && (
            <p className="text-xs text-slate-600">No properties</p>
          )}
          {Object.entries(selectedEntity.properties).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="w-16 text-slate-400">{key}</span>
              <input
                type="text"
                value={String(value)}
                onChange={(e) =>
                  updateEntityProperty(selectedEntity.id, key, e.target.value)
                }
                aria-label={`Property ${key}`}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="key"
              aria-label="New property key"
              className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none focus:border-amber-500"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="value"
              aria-label="New property value"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddProperty}
              aria-label="Add property"
              className="rounded-lg bg-amber-500 px-2 py-1 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              +
            </button>
          </div>
        </div>
      )}

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
