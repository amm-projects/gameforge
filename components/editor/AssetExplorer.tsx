"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { TileType, EntityType } from "@/types/level";
import { useSelectionStore } from "@/stores/selectionStore";

type AssetCategory = {
  label: string;
  items: { type: TileType | EntityType; label: string; sprite: string }[];
};

const CATEGORIES: AssetCategory[] = [
  {
    label: "Suelo",
    items: [
      { type: "ground", label: "Ground", sprite: "/sprites/ground.svg" },
      { type: "brick", label: "Brick", sprite: "/sprites/brick.svg" },
      { type: "platform", label: "Platform", sprite: "/sprites/platform.svg" },
    ],
  },
  {
    label: "Pinchos",
    items: [
      { type: "spike-up", label: "Spike ↑", sprite: "/sprites/spike.svg" },
      { type: "spike-down", label: "Spike ↓", sprite: "/sprites/spike.svg" },
      { type: "spike-left", label: "Spike ←", sprite: "/sprites/spike.svg" },
      { type: "spike-right", label: "Spike →", sprite: "/sprites/spike.svg" },
    ],
  },
  {
    label: "Jugador",
    items: [
      { type: "player", label: "Player", sprite: "/sprites/player.svg" },
      { type: "checkpoint", label: "Checkpoint", sprite: "/sprites/checkpoint.svg" },
      { type: "goal", label: "Goal", sprite: "/sprites/goal.svg" },
    ],
  },
  {
    label: "Enemigos",
    items: [
      { type: "enemy", label: "Enemy", sprite: "/sprites/enemy.svg" },
    ],
  },
  {
    label: "Objetos",
    items: [
      { type: "coin", label: "Coin", sprite: "/sprites/coin.svg" },
      { type: "key", label: "Key", sprite: "/sprites/key.svg" },
      { type: "door", label: "Door", sprite: "/sprites/door.svg" },
    ],
  },
];

export function AssetExplorer() {
  const { selectedTile, selectedEntity, setSelectedTile, setSelectedEntity, activeTool } = useSelectionStore();

  const isSelected = useMemo(() => {
    return (type: TileType | EntityType) => {
      const tileTypes: TileType[] = ["ground", "brick", "platform", "spike-up", "spike-down", "spike-left", "spike-right"];
      if (tileTypes.includes(type as TileType)) {
        return activeTool === "tile" && selectedTile === type;
      }
      return activeTool === "entity" && selectedEntity === type;
    };
  }, [activeTool, selectedTile, selectedEntity]);

  return (
    <aside className="rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Assets</h2>
      <div className="mt-3 space-y-4">
        {CATEGORIES.map((category) => (
          <div key={category.label}>
            <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              {category.label}
            </h3>
            <div className="grid grid-cols-4 gap-1">
              {category.items.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    const tileTypes: TileType[] = ["ground", "brick", "platform", "spike-up", "spike-down", "spike-left", "spike-right"];
                    if (tileTypes.includes(item.type as TileType)) {
                      setSelectedTile(item.type as TileType);
                    } else {
                      setSelectedEntity(item.type as EntityType);
                    }
                  }}
                  aria-label={`Select ${item.label}`}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition ${
                    isSelected(item.type)
                      ? "bg-amber-500/20 ring-1 ring-amber-500/50"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  <Image
                    src={item.sprite}
                    alt={item.label}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span className="text-[8px] text-slate-500">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
