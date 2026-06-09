"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CELL_SIZE } from "@/assets";
import { useEditorStore } from "@/stores/editorStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { LevelCanvas } from "@/components/editor/LevelCanvas";
import { ToolPanel } from "@/components/editor/ToolPanel";
import { SampleLevels } from "@/components/editor/SampleLevels";
import { InspectorPanel } from "@/components/editor/InspectorPanel";
import dynamic from "next/dynamic";
const GameRuntime = dynamic(() => import("@/components/runtime/GameRuntime").then((m) => m.GameRuntime), { ssr: false });
import type { LevelData, TileType, EntityType } from "@/types/level";

export function EditorShell() {
  const { width, height, tiles, entities, background, setTile, addEntity } = useEditorStore();
  const { isPlaying, setIsPlaying } = useRuntimeStore();

  const levelData: LevelData = useMemo(
    () => ({
      width,
      height,
      tiles,
      entities,
      background,
    }),
    [width, height, tiles, entities, background]
  );

  const runtimeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPlaying && runtimeRef.current) {
      runtimeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isPlaying]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    if (!over || over.id !== "grid" || !active.data.current) {
      return;
    }

    const gridEl = document.getElementById("grid");
    if (!gridEl) return;

    const gridRect = gridEl.getBoundingClientRect();
    const activatorEvent = event.activatorEvent as PointerEvent | undefined;
    if (!activatorEvent) return;

    const dropX = activatorEvent.clientX + delta.x;
    const dropY = activatorEvent.clientY + delta.y;

    const x = Math.floor((dropX - gridRect.left) / CELL_SIZE);
    const y = Math.floor((dropY - gridRect.top) / CELL_SIZE);

    const { width: levelWidth, height: levelHeight } = useEditorStore.getState();
    if (x < 0 || x >= levelWidth || y < 0 || y >= levelHeight) return;

    const payload = active.data.current as { type: string; tileType?: string; entityType?: string };
    if (payload.type === "tile") {
      setTile({ x, y, type: payload.tileType as TileType });
      return;
    }

    if (payload.type === "entity") {
      addEntity(payload.entityType as EntityType, x, y);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100" suppressHydrationWarning>
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
              aria-label="Play: iniciar runtime del nivel"
              className="rounded-2xl bg-amber-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Play
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              aria-label="Stop: detener runtime del nivel"
              className="rounded-2xl border border-slate-700 px-4 py-2 text-slate-100 transition hover:border-slate-500"
            >
              Stop
            </button>
            <span role="status" className="rounded-2xl bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
              {isPlaying ? "Runtime activo" : "Editor activo"}
            </span>
          </div>
        </div>
      </header>

      {isPlaying && (
        <div ref={runtimeRef}>
          <GameRuntime level={levelData} onStop={handleStop} />
        </div>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="mx-auto flex min-h-[calc(100vh-104px)] max-w-[1440px] flex-col gap-4 p-6 lg:flex-row">
          <div className="w-full max-w-sm lg:w-[320px] space-y-4 min-h-[300px]">
            <ToolPanel />
            <SampleLevels />
          </div>
          <div className="flex-1 min-h-[400px]">
            <LevelCanvas />
          </div>
          <div className="w-full max-w-lg lg:w-[420px]">
            <InspectorPanel />
          </div>
        </div>
      </DndContext>
    </main>
  );
}
