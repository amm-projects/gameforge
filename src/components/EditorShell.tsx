"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { preloadPhaser } from "@/lib/phaser";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { CELL_SIZE } from "@/assets";
import { useEditorStore } from "@/stores/editorStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { useLocaleStore } from "@/stores/localeStore";
import { useT } from "@/hooks/useTranslate";
import { LevelCanvas } from "@/components/editor/LevelCanvas";
import { ToolPanel } from "@/components/editor/ToolPanel";
import { SampleLevels } from "@/components/editor/SampleLevels";
import { InspectorPanel } from "@/components/editor/InspectorPanel";
import dynamic from "next/dynamic";
const GameRuntime = dynamic(() => import("@/components/runtime/GameRuntime").then((m) => m.GameRuntime), { ssr: false });
import type { LevelData, TileType, EntityType } from "@/types/level";

export function EditorShell() {
  const { width, height, tiles, entities, background, music, setTile, addEntity } = useEditorStore();
  const { isPlaying, setIsPlaying, isImmersive } = useRuntimeStore();
  const { locale, setLocale } = useLocaleStore();
  const t = useT();

  const levelData: LevelData = useMemo(
    () => ({
      width,
      height,
      tiles,
      entities,
      background,
      music,
    }),
    [width, height, tiles, entities, background, music]
  );

  const runtimeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    preloadPhaser();
  }, []);

  useEffect(() => {
    if (isPlaying && runtimeRef.current) {
      runtimeRef.current.scrollIntoView({ block: "center" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
      <header className={`border-b border-slate-800/80 bg-slate-900/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 ${isImmersive ? "hidden" : ""}`}>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.5rem] uppercase tracking-[0.3em] text-amber-400 sm:text-xs">GameForge</p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:mt-2 sm:text-2xl lg:text-3xl">{t("editor.title")}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "es" : "en")}
              aria-label={t("editor.play")}
              className="rounded-2xl border border-slate-700 px-2 py-1.5 text-[0.625rem] font-semibold text-slate-400 transition hover:border-slate-500 sm:px-3 sm:py-2 sm:text-xs"
            >
              {locale === "en" ? "ES" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={t("editor.playAria")}
              className="rounded-2xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 sm:px-4 sm:py-2"
            >
              {t("editor.play")}
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              aria-label={t("editor.stopAria")}
              className="rounded-2xl border border-slate-700 px-3 py-1.5 text-xs text-slate-100 transition hover:border-slate-500 sm:px-4 sm:py-2"
            >
              {t("editor.stop")}
            </button>
            <span role="status" className="rounded-2xl bg-slate-800 px-2 py-1.5 text-[0.5rem] uppercase tracking-[0.22em] text-slate-400 sm:px-3 sm:py-2 sm:text-xs">
              {isPlaying ? t("editor.statusRuntime") : t("editor.statusEditor")}
            </span>
          </div>
        </div>
      </header>

      {isPlaying && (
        <div ref={runtimeRef}>
          <GameRuntime level={levelData} onStop={handleStop} />
        </div>
      )}

      {!isPlaying && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:p-6">
            <div className="w-full space-y-4 lg:w-[280px] lg:shrink-0 xl:w-[320px]">
              <ToolPanel />
              <SampleLevels />
            </div>
            <div className="min-w-0 flex-1">
              <LevelCanvas />
            </div>
            <div className="w-full lg:w-[300px] lg:shrink-0 xl:w-[360px]">
              <InspectorPanel />
            </div>
          </div>
        </DndContext>
      )}
    </main>
  );
}
