"use client";

import { useEffect, useRef, useState } from "react";
import type { Game } from "phaser";
import type { LevelData, BackgroundTheme } from "@/types/level";
import { BACKGROUND_COLORS } from "@/types/level";
import { useT } from "@/hooks/useTranslate";
import { useLocaleStore } from "@/stores/localeStore";
import { createRuntimeScene } from "@/engine/runtime";
import { preloadPhaser } from "@/lib/phaser";

export function GameRuntime({ level, onStop }: { level: LevelData; onStop: () => void }) {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showHitboxes, setShowHitboxes] = useState(false);
  const toggleDebugRef = useRef<(() => void) | null>(null);
  const canvasWidth = Math.min(level.width * 32, 1280);
  const canvasHeight = Math.min(level.height * 32, 720);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    let game: Game | null = null;
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

      game = new PhaserLib.Game({
        type: PhaserLib.AUTO,
        parent: containerRef.current!,
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: bgColor,
        scale: {
          mode: PhaserLib.Scale.NONE,
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
      if (game) {
        game.scene.stop("runtime");
        game.destroy(true);
        game = null;
      }
    };
  }, [level, onStop, locale, t, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (isReady && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isReady]);

  return (
    <section className="mx-auto mt-6 max-w-full rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{t("runtime.title")}</h2>
          <p className="text-sm text-slate-400">{t("runtime.description")}</p>
          <p className="mt-2 text-sm text-slate-300">
            {runtimeError
              ? t("runtime.errorLabel", { message: runtimeError })
              : isReady
              ? t("runtime.ready")
              : t("runtime.initializing")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleDebugRef.current?.()}
            aria-label={showHitboxes ? t("runtime.hideHitboxesAria") : t("runtime.showHitboxesAria")}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white transition ${
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
            className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
          >
            {t("runtime.stop")}
          </button>
        </div>
      </div>
      <div
        className="overflow-hidden rounded-3xl border border-slate-900/80 bg-black w-full"
        style={{ height: canvasHeight }}
        ref={containerRef}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      />
    </section>
  );
}
