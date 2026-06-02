"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEditorStore } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { LevelCanvas } from "@/components/editor/LevelCanvas";
import { ToolPanel } from "@/components/editor/ToolPanel";
import { InspectorPanel } from "@/components/editor/InspectorPanel";
import { GameRuntime } from "@/components/runtime/GameRuntime";
import type { LevelData } from "@/types/level";

export function EditorShell() {
  const { width, height, tiles, entities, setTile, addEntity } = useEditorStore();
  const { activeTool, selectedTile, selectedEntity } = useSelectionStore();
  const { isPlaying, setIsPlaying } = useRuntimeStore();

  const levelData: LevelData = { width, height, tiles, entities };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active.data.current) {
      return;
    }

    const target = over.id as string;
    if (!target.startsWith("cell-")) {
      return;
    }

    const [, xString, yString] = target.split("-");
    const x = Number(xString);
    const y = Number(yString);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      return;
    }

    const payload = active.data.current as { type: string; tileType?: string; entityType?: string };
    if (payload.type === "tile") {
      setTile({ x, y, type: payload.tileType as typeof selectedTile });
      return;
    }

    if (payload.type === "entity") {
      addEntity(payload.entityType as typeof selectedEntity, x, y);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-900/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400">GameForge</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Editor de niveles 2D</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              disabled={!entities.some((entity) => entity.type === "player")}
              className="rounded-2xl bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-amber-400"
            >
              Play
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="rounded-2xl border border-slate-700 px-4 py-2 text-slate-100 transition hover:border-slate-500"
            >
              Stop
            </button>
            <span className="rounded-2xl bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
              {isPlaying ? "Runtime activo" : "Editor activo"}
            </span>
          </div>
        </div>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-[1440px] flex-col gap-4 p-6 lg:flex-row">
          <div className="w-full max-w-sm lg:w-[320px]">
            <ToolPanel />
          </div>
          <div className="flex-1">
            <LevelCanvas />
          </div>
          <div className="w-full max-w-lg lg:w-[420px]">
            <InspectorPanel />
          </div>
        </div>
      </DndContext>

      {isPlaying && <GameRuntime level={levelData} onStop={() => setIsPlaying(false)} />}
    </main>
  );
}
