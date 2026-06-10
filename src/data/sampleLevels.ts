import { makeId } from "@/lib/utils";
import type { LevelData, Tile, Entity, BackgroundTheme, MusicTheme } from "@/types/level";

interface SampleLevel {
  id: string;
  name: string;
  description: string;
  level: LevelData;
}

function groundRow(y: number, fromX: number, toX: number, type: "ground" | "brick" = "ground"): Tile[] {
  const tiles: Tile[] = [];
  for (let x = fromX; x <= toX; x++) {
    tiles.push({ x, y, type });
  }
  return tiles;
}

function coinAt(x: number, y: number): Entity {
  return { id: makeId(), type: "coin", position: { x, y }, properties: {} };
}

function enemyAt(x: number, y: number): Entity {
  return { id: makeId(), type: "enemy", position: { x, y }, properties: {} };
}

function spikeAt(x: number, y: number, dir: "up" | "down" | "left" | "right" = "up"): Tile {
  return { x, y, type: `spike-${dir}` as const };
}

const empty: SampleLevel = {
  id: "empty",
  name: "Empty",
  description: "Start from scratch",
  level: { width: 64, height: 64, tiles: [], entities: [], background: "dark", music: "calm" },
};

const firstSteps: SampleLevel = {
  id: "first-steps",
  name: "First Steps",
  description: "A simple platform to get started",
  level: (() => {
    const width = 30;
    const height = 20;
    const tiles: Tile[] = [
      ...groundRow(19, 0, width - 1),
      { x: 15, y: 15, type: "platform" },
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 18 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: width - 3, y: 18 }, properties: {} },
    ];
    return { width, height, tiles, entities, background: "sky" as BackgroundTheme, music: "calm" as MusicTheme };
  })(),
};

const coinRun: SampleLevel = {
  id: "coin-run",
  name: "Coin Run",
  description: "Collect coins while avoiding enemies",
  level: (() => {
    const width = 40;
    const height = 20;
    const tiles: Tile[] = [
      ...groundRow(19, 0, width - 1),
      ...groundRow(15, 10, 14, "brick"),
      ...groundRow(11, 20, 24, "brick"),
      ...groundRow(15, 30, 34, "brick"),
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 18 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: width - 3, y: 18 }, properties: {} },
      coinAt(12, 14),
      coinAt(13, 14),
      coinAt(14, 14),
      coinAt(22, 10),
      coinAt(23, 10),
      coinAt(32, 14),
      coinAt(33, 14),
      enemyAt(8, 18),
      enemyAt(25, 18),
    ];
    return { width, height, tiles, entities, background: "forest" as BackgroundTheme, music: "adventure" as MusicTheme };
  })(),
};

const dangerPass: SampleLevel = {
  id: "danger-pass",
  name: "Danger Pass",
  description: "Navigate through spikes and enemies",
  level: (() => {
    const width = 30;
    const height = 20;
    const tiles: Tile[] = [
      ...groundRow(19, 0, width - 1),
      spikeAt(6, 18),
      spikeAt(7, 18),
      spikeAt(8, 18),
      { x: 12, y: 16, type: "platform" },
      { x: 13, y: 16, type: "platform" },
      spikeAt(14, 18),
      spikeAt(15, 18),
      spikeAt(16, 18),
      { x: 20, y: 16, type: "platform" },
      { x: 21, y: 16, type: "platform" },
      spikeAt(22, 18),
      spikeAt(23, 18),
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 18 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: width - 3, y: 18 }, properties: {} },
      enemyAt(4, 18),
      enemyAt(10, 18),
      enemyAt(18, 18),
      coinAt(2, 14),
      coinAt(12, 15),
      coinAt(20, 15),
    ];
    return { width, height, tiles, entities, background: "desert" as BackgroundTheme, music: "adventure" as MusicTheme };
  })(),
};

const skyFortress: SampleLevel = {
  id: "sky-fortress",
  name: "Sky Fortress",
  description: "Ascend through floating platforms to reach the goal",
  level: (() => {
    const width = 40;
    const height = 30;
    const tiles: Tile[] = [
      ...groundRow(29, 0, width - 1),
      { x: 5, y: 25, type: "platform" },
      { x: 6, y: 25, type: "platform" },
      { x: 11, y: 22, type: "platform" },
      { x: 12, y: 22, type: "platform" },
      { x: 17, y: 19, type: "platform" },
      { x: 18, y: 19, type: "platform" },
      { x: 23, y: 16, type: "platform" },
      { x: 24, y: 16, type: "platform" },
      { x: 29, y: 13, type: "platform" },
      { x: 30, y: 13, type: "platform" },
      { x: 34, y: 13, type: "platform" },
      { x: 35, y: 10, type: "platform" },
      { x: 36, y: 10, type: "platform" },
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 28 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: 36, y: 9 }, properties: {} },
      enemyAt(8, 28),
      enemyAt(20, 28),
      enemyAt(15, 18),
      enemyAt(26, 15),
      coinAt(6, 24),
      coinAt(12, 21),
      coinAt(18, 18),
      coinAt(24, 15),
      coinAt(30, 12),
    ];
    return { width, height, tiles, entities, background: "sunset" as BackgroundTheme, music: "adventure" as MusicTheme };
  })(),
};

const underground: SampleLevel = {
  id: "underground",
  name: "Underground",
  description: "Navigate a tight cave with low ceilings and enemies",
  level: (() => {
    const width = 40;
    const height = 15;
    const tiles: Tile[] = [
      ...groundRow(14, 0, width - 1),
      { x: 5, y: 0, type: "brick" },
      { x: 6, y: 0, type: "brick" },
      { x: 7, y: 0, type: "brick" },
      { x: 8, y: 0, type: "brick" },
      { x: 9, y: 0, type: "brick" },
      { x: 10, y: 0, type: "brick" },
      { x: 12, y: 7, type: "platform" },
      { x: 13, y: 7, type: "platform" },
      { x: 18, y: 0, type: "brick" },
      { x: 18, y: 10, type: "platform" },
      { x: 19, y: 0, type: "brick" },
      { x: 20, y: 0, type: "brick" },
      { x: 21, y: 0, type: "brick" },
      { x: 22, y: 0, type: "brick" },
      { x: 25, y: 7, type: "platform" },
      { x: 26, y: 7, type: "platform" },
      { x: 30, y: 0, type: "brick" },
      { x: 31, y: 0, type: "brick" },
      { x: 32, y: 0, type: "brick" },
      { x: 33, y: 0, type: "brick" },
      { x: 34, y: 0, type: "brick" },
      spikeAt(10, 13),
      spikeAt(11, 13),
      spikeAt(22, 13),
      spikeAt(23, 13),
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 13 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: width - 3, y: 13 }, properties: {} },
      enemyAt(5, 13),
      enemyAt(15, 13),
      enemyAt(28, 13),
      coinAt(3, 6),
      coinAt(13, 6),
      coinAt(26, 6),
      coinAt(15, 4),
    ];
    return { width, height, tiles, entities, background: "purple" as BackgroundTheme, music: "mystery" as MusicTheme };
  })(),
};

const speedRun: SampleLevel = {
  id: "speed-run",
  name: "Speed Run",
  description: "A flat sprint with enemies and obstacles in your way",
  level: (() => {
    const width = 50;
    const height = 15;
    const tiles: Tile[] = [
      ...groundRow(14, 0, width - 1),
      { x: 10, y: 12, type: "brick" },
      { x: 11, y: 12, type: "brick" },
      { x: 20, y: 12, type: "brick" },
      { x: 21, y: 12, type: "brick" },
      { x: 30, y: 10, type: "platform" },
      { x: 31, y: 10, type: "platform" },
      { x: 40, y: 12, type: "brick" },
      { x: 41, y: 12, type: "brick" },
      spikeAt(16, 13),
      spikeAt(17, 13),
      spikeAt(36, 13),
      spikeAt(37, 13),
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 13 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: width - 3, y: 13 }, properties: {} },
      enemyAt(5, 13),
      enemyAt(14, 13),
      enemyAt(24, 13),
      enemyAt(34, 13),
      enemyAt(44, 13),
      coinAt(7, 8),
      coinAt(15, 8),
      coinAt(24, 8),
      coinAt(31, 9),
      coinAt(38, 8),
    ];
    return { width, height, tiles, entities, background: "desert" as BackgroundTheme, music: "retro" as MusicTheme };
  })(),
};

const treasureTower: SampleLevel = {
  id: "treasure-tower",
  name: "Treasure Tower",
  description: "Climb the tower and collect all the treasure",
  level: (() => {
    const width = 20;
    const height = 40;
    const tiles: Tile[] = [
      ...groundRow(39, 0, width - 1),
      { x: 4, y: 34, type: "platform" },
      { x: 5, y: 34, type: "platform" },
      { x: 13, y: 34, type: "platform" },
      { x: 14, y: 34, type: "platform" },
      { x: 17, y: 31, type: "platform" },
      { x: 4, y: 28, type: "platform" },
      { x: 5, y: 28, type: "platform" },
      { x: 13, y: 28, type: "platform" },
      { x: 14, y: 28, type: "platform" },
      { x: 8, y: 24, type: "platform" },
      { x: 9, y: 24, type: "platform" },
      { x: 10, y: 24, type: "platform" },
      { x: 4, y: 19, type: "platform" },
      { x: 5, y: 19, type: "platform" },
      { x: 13, y: 19, type: "platform" },
      { x: 14, y: 19, type: "platform" },
      { x: 8, y: 14, type: "platform" },
      { x: 9, y: 14, type: "platform" },
      { x: 10, y: 14, type: "platform" },
      { x: 4, y: 9, type: "platform" },
      { x: 5, y: 9, type: "platform" },
      { x: 6, y: 9, type: "platform" },
      { x: 7, y: 9, type: "platform" },
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 38 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: 6, y: 8 }, properties: {} },
      enemyAt(7, 38),
      enemyAt(10, 33),
      enemyAt(10, 27),
      enemyAt(7, 23),
      enemyAt(10, 18),
      enemyAt(6, 13),
      coinAt(5, 33),
      coinAt(14, 33),
      coinAt(5, 27),
      coinAt(14, 27),
      coinAt(9, 23),
      coinAt(5, 18),
      coinAt(14, 18),
      coinAt(9, 13),
      //coinAt(6, 8),
    ];
    return { width, height, tiles, entities, background: "forest" as BackgroundTheme, music: "mystery" as MusicTheme };
  })(),
};

const bridgeOfSpikes: SampleLevel = {
  id: "bridge-of-spikes",
  name: "Bridge of Spikes",
  description: "Cross the narrow bridge while spikes line the pit below",
  level: (() => {
    const width = 35;
    const height = 20;
    const tiles: Tile[] = [
      ...groundRow(19, 0, 4),
      ...groundRow(19, 30, width - 1),
      spikeAt(5, 18),
      spikeAt(6, 18),
      spikeAt(7, 18),
      spikeAt(8, 18),
      spikeAt(9, 18),
      spikeAt(10, 18),
      spikeAt(11, 18),
      spikeAt(12, 18),
      spikeAt(13, 18),
      spikeAt(14, 18),
      spikeAt(15, 18),
      spikeAt(16, 18),
      spikeAt(17, 18),
      spikeAt(18, 18),
      spikeAt(19, 18),
      spikeAt(20, 18),
      spikeAt(21, 18),
      spikeAt(22, 18),
      spikeAt(23, 18),
      spikeAt(24, 18),
      spikeAt(25, 18),
      spikeAt(26, 18),
      spikeAt(27, 18),
      spikeAt(28, 18),
      spikeAt(29, 18),
      { x: 5, y: 15, type: "platform" },
      { x: 6, y: 15, type: "platform" },
      { x: 8, y: 13, type: "platform" },
      { x: 9, y: 13, type: "platform" },
      { x: 12, y: 15, type: "platform" },
      { x: 13, y: 15, type: "platform" },
      { x: 15, y: 12, type: "platform" },
      { x: 16, y: 12, type: "platform" },
      { x: 17, y: 12, type: "platform" },
      { x: 19, y: 15, type: "platform" },
      { x: 20, y: 15, type: "platform" },
      { x: 22, y: 13, type: "platform" },
      { x: 23, y: 13, type: "platform" },
      { x: 25, y: 15, type: "platform" },
      { x: 26, y: 15, type: "platform" },
      { x: 27, y: 15, type: "platform" },
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 2, y: 18 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: width - 2, y: 18 }, properties: {} },
      enemyAt(8, 14),
      enemyAt(15, 11),
      enemyAt(23, 12),
      coinAt(6, 14),
      coinAt(9, 12),
      coinAt(13, 14),
      coinAt(16, 11),
      coinAt(20, 14),
      coinAt(23, 12),
      coinAt(27, 14),
    ];
    return { width, height, tiles, entities, background: "dark" as BackgroundTheme, music: "boss" as MusicTheme };
  })(),
};

const verticalDescent: SampleLevel = {
  id: "vertical-descent",
  name: "Vertical Descent",
  description: "Drop down a narrow shaft filled with platforms and danger",
  level: (() => {
    const width = 15;
    const height = 45;
    const tiles: Tile[] = [
      ...groundRow(44, 0, width - 1),
      { x: 4, y: 38, type: "platform" },
      { x: 5, y: 38, type: "platform" },
      { x: 9, y: 38, type: "platform" },
      { x: 10, y: 38, type: "platform" },
      { x: 4, y: 32, type: "platform" },
      { x: 5, y: 32, type: "platform" },
      { x: 9, y: 32, type: "platform" },
      { x: 10, y: 32, type: "platform" },
      { x: 6, y: 26, type: "platform" },
      { x: 7, y: 26, type: "platform" },
      { x: 8, y: 26, type: "platform" },
      { x: 4, y: 20, type: "platform" },
      { x: 5, y: 20, type: "platform" },
      { x: 9, y: 20, type: "platform" },
      { x: 10, y: 20, type: "platform" },
      { x: 6, y: 14, type: "platform" },
      { x: 7, y: 14, type: "platform" },
      { x: 8, y: 14, type: "platform" },
      { x: 4, y: 8, type: "platform" },
      { x: 5, y: 8, type: "platform" },
      { x: 9, y: 8, type: "platform" },
      { x: 10, y: 8, type: "platform" },
      //spikeAt(7, 43),
      spikeAt(8, 43),
      spikeAt(6, 31),
      spikeAt(8, 31),
      spikeAt(6, 19),
      spikeAt(8, 19),
    ];
    const entities: Entity[] = [
      { id: makeId(), type: "player", position: { x: 7, y: 1 }, properties: {} },
      { id: makeId(), type: "goal", position: { x: 7, y: 43 }, properties: {} },
      enemyAt(5, 37),
      enemyAt(10, 31),
      enemyAt(5, 25),
      enemyAt(10, 19),
      enemyAt(5, 13),
      enemyAt(10, 7),
      coinAt(5, 37),
      coinAt(10, 31),
      coinAt(7, 25),
      coinAt(5, 19),
      coinAt(10, 13),
      coinAt(7, 7),
      coinAt(5, 3),
    ];
    return { width, height, tiles, entities, background: "sky" as BackgroundTheme, music: "boss" as MusicTheme };
  })(),
};

export const sampleLevels: SampleLevel[] = [
  empty,
  firstSteps,
  coinRun,
  dangerPass,
  skyFortress,
  underground,
  speedRun,
  treasureTower,
  bridgeOfSpikes,
  verticalDescent,
];
