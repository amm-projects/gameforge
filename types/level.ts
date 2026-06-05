export type TileType = "ground" | "brick" | "platform" | "spike-up" | "spike-down" | "spike-left" | "spike-right";
export type EntityType = "player" | "coin" | "enemy" | "goal" | "checkpoint" | "door" | "key";

export const LAYERS = {
  BACKGROUND: 0,
  DECORATION: 1,
  SOLID: 2,
  ENEMIES: 3,
  OBJECTS: 4,
  PLAYER: 5,
} as const;

export type Layer = (typeof LAYERS)[keyof typeof LAYERS];

export const LAYER_NAMES: Record<Layer, string> = {
  [LAYERS.BACKGROUND]: "Fondo",
  [LAYERS.DECORATION]: "Decoración",
  [LAYERS.SOLID]: "Tiles sólidos",
  [LAYERS.ENEMIES]: "Enemigos",
  [LAYERS.OBJECTS]: "Objetos",
  [LAYERS.PLAYER]: "Jugador",
};

export const LAYER_VISIBLE_DEFAULT: Record<Layer, boolean> = {
  [LAYERS.BACKGROUND]: true,
  [LAYERS.DECORATION]: true,
  [LAYERS.SOLID]: true,
  [LAYERS.ENEMIES]: true,
  [LAYERS.OBJECTS]: true,
  [LAYERS.PLAYER]: true,
};

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  layer?: Layer;
}

export interface Entity {
  id: string;
  type: EntityType;
  position: {
    x: number;
    y: number;
  };
  properties: Record<string, unknown>;
}

export interface LevelData {
  width: number;
  height: number;
  tiles: Tile[];
  entities: Entity[];
}
