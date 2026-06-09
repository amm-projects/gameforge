export interface TileDefinition {
  id: string;
  nombre: string;
  categoria: "suelo" | "trampa" | "plataforma";
  sprite: string;
  solido: boolean;
}

export const TILE_REGISTRY: Record<string, TileDefinition> = {
  ground: {
    id: "ground",
    nombre: "Suelo",
    categoria: "suelo",
    sprite: "runtime-ground",
    solido: true,
  },
  brick: {
    id: "brick",
    nombre: "Ladrillo",
    categoria: "suelo",
    sprite: "runtime-brick",
    solido: true,
  },
  platform: {
    id: "platform",
    nombre: "Plataforma",
    categoria: "plataforma",
    sprite: "runtime-platform",
    solido: true,
  },
  "spike-up": {
    id: "spike-up",
    nombre: "Pinchos ↑",
    categoria: "trampa",
    sprite: "runtime-spike",
    solido: true,
  },
  "spike-down": {
    id: "spike-down",
    nombre: "Pinchos ↓",
    categoria: "trampa",
    sprite: "runtime-spike",
    solido: true,
  },
  "spike-left": {
    id: "spike-left",
    nombre: "Pinchos ←",
    categoria: "trampa",
    sprite: "runtime-spike",
    solido: true,
  },
  "spike-right": {
    id: "spike-right",
    nombre: "Pinchos →",
    categoria: "trampa",
    sprite: "runtime-spike",
    solido: true,
  },
} as const;

export function getTileDefinition(type: string): TileDefinition | undefined {
  return TILE_REGISTRY[type];
}

export function getAllTileDefinitions(): TileDefinition[] {
  return Object.values(TILE_REGISTRY);
}
