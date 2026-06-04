import { useCallback, useRef } from "react";
import { useEditorStore, type PaintAction } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";

const CELL_SIZE = 10;

function makeId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
}

export function useTileBrush() {
  const width = useEditorStore((s) => s.width);
  const height = useEditorStore((s) => s.height);
  const batchPaint = useEditorStore((s) => s.batchPaint);

  const activeTool = useSelectionStore((s) => s.activeTool);
  const selectedTile = useSelectionStore((s) => s.selectedTile);
  const selectedEntity = useSelectionStore((s) => s.selectedEntity);

  const isPainting = useRef(false);
  const painted = useRef<Set<string>>(new Set());
  const pendingActions = useRef<PaintAction[]>([]);
  const flushRaf = useRef<number | null>(null);

  const makeAction = useCallback(
    (x: number, y: number): PaintAction | null => {
      if (activeTool === "erase") return { kind: "erase", x, y };
      if (activeTool === "tile" && selectedTile) return { kind: "tile", x, y, tileType: selectedTile };
      if (activeTool === "entity" && selectedEntity) return { kind: "entity", x, y, entityType: selectedEntity, entityId: makeId() };
      return null;
    },
    [activeTool, selectedTile, selectedEntity]
  );

  const scheduleFlush = useCallback(() => {
    if (flushRaf.current !== null) return;
    flushRaf.current = requestAnimationFrame(() => {
      flushRaf.current = null;
      if (pendingActions.current.length === 0) return;
      const actions = pendingActions.current;
      pendingActions.current = [];
      batchPaint(actions);
    });
  }, [batchPaint]);

  const getCellFromEvent = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const gridEl = document.getElementById("grid");
      if (!gridEl) return null;
      const rect = gridEl.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left) / CELL_SIZE);
      const y = Math.floor((clientY - rect.top) / CELL_SIZE);
      if (x >= 0 && x < width && y >= 0 && y < height) return { x, y };
      return null;
    },
    [width, height]
  );

  return {
    isPainting,
    painted,
    pendingActions,
    flushRaf,
    makeAction,
    scheduleFlush,
    getCellFromEvent,
  };
}
