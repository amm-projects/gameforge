import type { TileType, EntityType, Tile, Entity, Layer } from "@/types/level";

export type PaintAction =
  | { kind: "tile"; x: number; y: number; tileType: TileType; layer?: Layer }
  | { kind: "entity"; x: number; y: number; entityType: EntityType; entityId: string }
  | { kind: "erase"; x: number; y: number };

export interface PaintResult {
  tiles: Tile[];
  entities: Entity[];
}

export function applyPaintActions(
  tiles: Tile[],
  entities: Entity[],
  actions: PaintAction[]
): PaintResult {
  let newTiles = [...tiles];
  let newEntities = [...entities];
  const seenTypes = new Set(newEntities.map((e) => e.type));

  for (const action of actions) {
    if (action.kind === "tile") {
      newTiles = newTiles.filter((t) => t.x !== action.x || t.y !== action.y);
      const removedEntity = newEntities.find((e) => e.position.x === action.x && e.position.y === action.y);
      if (removedEntity) seenTypes.delete(removedEntity.type);
      newEntities = newEntities.filter((e) => e.position.x !== action.x || e.position.y !== action.y);
      newTiles.push({ x: action.x, y: action.y, type: action.tileType, layer: action.layer });
    } else if (action.kind === "entity") {
      const isUnique = action.entityType !== "player" && action.entityType !== "goal";
      if (!isUnique && seenTypes.has(action.entityType)) continue;
      seenTypes.add(action.entityType);
      newTiles = newTiles.filter((t) => t.x !== action.x || t.y !== action.y);
      newEntities = newEntities.filter((e) => e.position.x !== action.x || e.position.y !== action.y);
      newEntities.push({
        id: action.entityId,
        type: action.entityType,
        position: { x: action.x, y: action.y },
        properties: {},
      });
    } else if (action.kind === "erase") {
      newTiles = newTiles.filter((t) => t.x !== action.x || t.y !== action.y);
      const removed = newEntities.find((e) => e.position.x === action.x && e.position.y === action.y);
      if (removed) seenTypes.delete(removed.type);
      newEntities = newEntities.filter((e) => e.position.x !== action.x || e.position.y !== action.y);
    }
  }

  return { tiles: newTiles, entities: newEntities };
}

export function isUniqueEntity(type: EntityType): boolean {
  return type !== "player" && type !== "goal";
}
