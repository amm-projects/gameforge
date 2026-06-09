import { describe, it, expect } from "vitest";
import { TILE_REGISTRY, getTileDefinition, getAllTileDefinitions } from "./tile-definitions";

describe("tile-definitions", () => {
  describe("TILE_REGISTRY", () => {
    it("contains ground", () => {
      expect(TILE_REGISTRY.ground).toBeDefined();
      expect(TILE_REGISTRY.ground.nombre).toBe("Suelo");
      expect(TILE_REGISTRY.ground.solido).toBe(true);
    });

    it("contains brick", () => {
      expect(TILE_REGISTRY.brick).toBeDefined();
      expect(TILE_REGISTRY.brick.nombre).toBe("Ladrillo");
    });

    it("contains platform", () => {
      expect(TILE_REGISTRY.platform).toBeDefined();
      expect(TILE_REGISTRY.platform.nombre).toBe("Plataforma");
    });

    it("contains four spike directions", () => {
      expect(TILE_REGISTRY["spike-up"]).toBeDefined();
      expect(TILE_REGISTRY["spike-down"]).toBeDefined();
      expect(TILE_REGISTRY["spike-left"]).toBeDefined();
      expect(TILE_REGISTRY["spike-right"]).toBeDefined();
    });

    it("all entries have the correct shape", () => {
      for (const def of Object.values(TILE_REGISTRY)) {
        expect(def).toHaveProperty("id");
        expect(def).toHaveProperty("nombre");
        expect(def).toHaveProperty("categoria");
        expect(def).toHaveProperty("sprite");
        expect(def).toHaveProperty("solido");
      }
    });
  });

  describe("getTileDefinition", () => {
    it("returns definition for known type", () => {
      const def = getTileDefinition("ground");
      expect(def).toBeDefined();
      expect(def?.nombre).toBe("Suelo");
    });

    it("returns undefined for unknown type", () => {
      const def = getTileDefinition("nonexistent");
      expect(def).toBeUndefined();
    });
  });

  describe("getAllTileDefinitions", () => {
    it("returns all definitions", () => {
      const all = getAllTileDefinitions();
      expect(all).toHaveLength(Object.keys(TILE_REGISTRY).length);
    });

    it("each definition has required fields", () => {
      const all = getAllTileDefinitions();
      for (const def of all) {
        expect(typeof def.id).toBe("string");
        expect(typeof def.nombre).toBe("string");
        expect(["suelo", "trampa", "plataforma"]).toContain(def.categoria);
        expect(typeof def.solido).toBe("boolean");
      }
    });
  });
});
