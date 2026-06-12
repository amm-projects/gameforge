export type TileType = "ground" | "brick" | "platform" | "spike-up" | "spike-down" | "spike-left" | "spike-right";
export type EntityType = "player" | "coin" | "enemy" | "goal" | "checkpoint" | "door" | "key" | "patrol" | "jumper";
export type MoveAxis = "none" | "horizontal" | "vertical";

export interface TileProperties {
  moveAxis?: MoveAxis;
  moveSpeed?: number;
  moveRange?: number;
}

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  solid?: boolean;
  collision?: boolean;
  properties?: TileProperties;
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

export type MusicTheme = "calm" | "adventure" | "retro" | "mystery" | "boss";

export const MUSIC_THEMES: Record<MusicTheme, string> = {
  calm: "calm",
  adventure: "adventure",
  retro: "retro",
  mystery: "mystery",
  boss: "boss",
};

export interface LevelData {
  width: number;
  height: number;
  tiles: Tile[];
  entities: Entity[];
  background?: BackgroundTheme;
  music?: MusicTheme;
}
