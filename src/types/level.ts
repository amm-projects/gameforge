export type TileType = "ground" | "brick" | "platform" | "spike-up" | "spike-down" | "spike-left" | "spike-right";
export type EntityType = "player" | "coin" | "enemy" | "goal" | "checkpoint" | "door" | "key";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  solid?: boolean;
  properties?: Record<string, unknown>;
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

export type BackgroundTheme = "dark" | "sky" | "forest" | "desert" | "sunset" | "purple";

export const BACKGROUND_COLORS: Record<BackgroundTheme, string> = {
  dark: "#0f172a",
  sky: "#38bdf8",
  forest: "#166534",
  desert: "#d97706",
  sunset: "#9d174d",
  purple: "#4c1d95",
};

export const BACKGROUND_LABELS: Record<BackgroundTheme, string> = {
  dark: "Oscuro",
  sky: "Cielo",
  forest: "Bosque",
  desert: "Desierto",
  sunset: "Atardecer",
  purple: "Púrpura",
};

export interface LevelData {
  width: number;
  height: number;
  tiles: Tile[];
  entities: Entity[];
  background?: BackgroundTheme;
}
