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
  spike: {
    id: "spike",
    nombre: "Pinchos",
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
