import { describe, it, expect } from "vitest";
import { levelDataSchema, tileSchema, entitySchema } from "./level.schema";

describe("level.schema", () => {
  describe("levelDataSchema", () => {
    it("accepts valid level data", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [{ x: 0, y: 0, type: "ground" }],
        entities: [{ id: "p1", type: "player", position: { x: 5, y: 5 } }],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("rejects missing width", () => {
      const data = { height: 64, tiles: [], entities: [] };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects invalid tile type", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [{ x: 0, y: 0, type: "invalid_tile" }],
        entities: [],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects negative coordinates", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [{ x: -1, y: 0, type: "ground" }],
        entities: [],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects width out of range", () => {
      const data = { width: 999, height: 64, tiles: [], entities: [] };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("transforms legacy spike to spike-up", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [{ x: 0, y: 0, type: "spike" }],
        entities: [],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tiles[0].type).toBe("spike-up");
      }
    });

    it("applies default background", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.background).toBe("dark");
      }
    });

    it("accepts explicit background", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
        background: "sky",
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.background).toBe("sky");
      }
    });

    it("rejects invalid background", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
        background: "invalid",
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("applies default music", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.music).toBe("calm");
      }
    });

    it("accepts explicit music", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
        music: "adventure",
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.music).toBe("adventure");
      }
    });

    it("rejects invalid music", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
        music: "invalid",
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("transforms missing properties to empty object on tiles", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [{ x: 0, y: 0, type: "ground" }],
        entities: [],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tiles[0].properties).toEqual({});
      }
    });

    it("transforms missing properties to empty object on entities", () => {
      const data = {
        width: 64,
        height: 64,
        tiles: [],
        entities: [{ id: "p1", type: "player", position: { x: 0, y: 0 } }],
      };
      const result = levelDataSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.entities[0].properties).toEqual({});
      }
    });
  });
});
