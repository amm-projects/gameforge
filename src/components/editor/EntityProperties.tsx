"use client";

import { useState } from "react";
import type { Entity } from "@/types/level";

export function EntityProperties({
  entity,
  updateEntityProperty,
}: {
  entity: Entity;
  updateEntityProperty: (id: string, key: string, value: unknown) => void;
}) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAddProperty = () => {
    if (!newKey.trim()) return;
    updateEntityProperty(entity.id, newKey.trim(), newValue);
    setNewKey("");
    setNewValue("");
  };

  return (
    <div className="space-y-2 rounded-2xl border border-slate-800/80 bg-slate-900 p-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {entity.type} Properties
      </h3>
      {Object.keys(entity.properties).length === 0 && (
        <p className="text-xs text-slate-600">No properties</p>
      )}
      {Object.entries(entity.properties).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 text-xs">
          <span className="w-16 text-slate-400">{key}</span>
          <input
            type="text"
            value={String(value)}
            onChange={(e) => updateEntityProperty(entity.id, key, e.target.value)}
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
  );
}
