"use client";

import { useEffect, useRef, useState } from "react";
import type { Game } from "phaser";
import type { LevelData, BackgroundTheme } from "@/types/level";
import { BACKGROUND_COLORS } from "@/types/level";
import { useT } from "@/hooks/useTranslate";
import { useLocaleStore } from "@/stores/localeStore";
import { useRuntimeStore } from "@/stores/runtimeStore";
import { createRuntimeScene } from "@/engine/runtime";
import { preloadPhaser } from "@/lib/phaser";

function useDisplayMode(): { isPortrait: boolean; isImmersive: boolean } {
  const [mode, setMode] = useState<{ isPortrait: boolean; isImmersive: boolean }>({
    isPortrait: false,
    isImmersive: false,
  });

  useEffect(() => {
    const check = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        setMode({ isPortrait: false, isImmersive: false });
        return;
      }
      const portrait = window.innerHeight > window.innerWidth;
      setMode({ isPortrait: portrait, isImmersive: !portrait });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return mode;
}

export function GameRuntime({ level, onStop }: { level: LevelData; onStop: () => void }) {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const setImmersive = useRuntimeStore((s) => s.setImmersive);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showHitboxes, setShowHitboxes] = useState(false);
  const toggleDebugRef = useRef<(() => void) | null>(null);
  const { isPortrait, isImmersive } = useDisplayMode();

  useEffect(() => {
    setImmersive(isImmersive);
    return () => setImmersive(false);
  }, [isImmersive, setImmersive]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    let isDisposed = false;

    const initializeGame = async () => {
      setRuntimeError(null);
      setIsReady(false);

      const PhaserLib = await preloadPhaser();
      if (isDisposed || !containerRef.current) {
        return;
      }

      const currentLocale = useLocaleStore.getState().locale;
      const RuntimeScene = createRuntimeScene(
        PhaserLib,
        { onStop, setShowHitboxes, locale: currentLocale },
        toggleDebugRef
      );

      const bgTheme = (level.background ?? "dark") as BackgroundTheme;
      const bgColor = BACKGROUND_COLORS[bgTheme];

      const game = new PhaserLib.Game({
        type: PhaserLib.AUTO,
        parent: containerRef.current!,
        width: 1280,
        height: 720,
        backgroundColor: bgColor,
        scale: {
          mode: PhaserLib.Scale.FIT,
          autoCenter: PhaserLib.Scale.CENTER_BOTH,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 1800 },
            debug: false,
          },
        },
        scene: [RuntimeScene],
      });

      gameRef.current = game;
      game.scene.start("runtime", { level, locale: currentLocale });
      if (!isDisposed) {
        setIsReady(true);
      }
    };

    void initializeGame().catch(() => {
      if (isDisposed) {
        return;
      }

      setRuntimeError(t("runtime.errorInit"));
    });

    return () => {
      isDisposed = true;
      setIsReady(false);
      if (gameRef.current) {
        gameRef.current.scene.stop("runtime");
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [level, onStop, locale, t]);

  useEffect(() => {
    if (isReady && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isReady]);

  useEffect(() => {
    try {
      const orientation = (screen as unknown as { orientation?: { lock?: (t: string) => Promise<void> } }).orientation;
      if (typeof orientation?.lock === "function") {
        orientation.lock("landscape").catch(() => {});
      }
    } catch {
      /**/
    }
  }, []);

  useEffect(() => {
    if (gameRef.current) {
      window.dispatchEvent(new Event("resize"));
    }
  }, [isImmersive, isPortrait]);

  if (isImmersive) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black"
        onClick={() => containerRef.current?.focus()}
      >
        <div ref={containerRef} className="h-full w-full" tabIndex={0} />
        <button
          type="button"
          onClick={onStop}
          aria-label={t("runtime.stopAria")}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-slate-700/80"
        >
          ✕ {t("runtime.stop")}
        </button>
      </div>
    );
  }

  if (isPortrait) {
    return (
      <section className="mx-auto mt-4 w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-950/95 p-3 shadow-xl shadow-slate-950/10 sm:mt-6 sm:p-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="mb-4 h-16 w-16 animate-pulse text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1" />
            <path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
            <path d="M9 12l-3 3 3 3" />
            <path d="M15 12l3 3-3 3" />
          </svg>
          <p className="text-lg font-bold text-white">{t("runtime.rotateDevice")}</p>
          <p className="mt-2 max-w-xs text-sm text-slate-400">{t("runtime.rotateDescription")}</p>
        </div>
        <div className="hidden">
          <div ref={containerRef} />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-4 w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-950/95 p-3 shadow-xl shadow-slate-950/10 sm:mt-6 sm:p-4">
      <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white sm:text-base">{t("runtime.title")}</h2>
          <p className="text-xs text-slate-400 sm:text-sm">{t("runtime.description")}</p>
          <p className="mt-1 truncate text-xs text-slate-300 sm:mt-2 sm:text-sm">
            {runtimeError
              ? t("runtime.errorLabel", { message: runtimeError })
              : isReady
              ? t("runtime.ready")
              : t("runtime.initializing")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleDebugRef.current?.()}
            aria-label={showHitboxes ? t("runtime.hideHitboxesAria") : t("runtime.showHitboxesAria")}
            className={`rounded-2xl px-3 py-1.5 text-xs font-semibold text-white transition sm:px-4 sm:py-2 sm:text-sm ${
              showHitboxes
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {showHitboxes ? t("runtime.hitboxesOn") : t("runtime.hitboxesOff")}
          </button>
          <button
            type="button"
            onClick={onStop}
            aria-label={t("runtime.stopAria")}
            className="rounded-2xl bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-600 sm:px-4 sm:py-2 sm:text-sm"
          >
            {t("runtime.stop")}
          </button>
        </div>
      </div>
      <div
        className="relative w-full overflow-hidden rounded-3xl border border-slate-900/80 bg-black"
        style={{ aspectRatio: "16 / 9", maxHeight: "calc(100vh - 210px)" }}
        ref={containerRef}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      />
    </section>
  );
}
