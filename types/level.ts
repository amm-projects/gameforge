export type TileType = "ground" | "spike";
export type EntityType = "player" | "coin" | "enemy" | "goal";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
}

export interface Entity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
}

export interface LevelData {
  width: number;
  height: number;
  tiles: Tile[];
  entities: Entity[];
}
