import { describe, it, expect } from "vitest";
import { applyPaintActions, isUniqueEntity } from "./paint-actions";
import type { PaintAction } from "./paint-actions";
import type { Tile, Entity } from "@/types/level";

describe("paint-actions", () => {
  describe("applyPaintActions", () => {
    it("adds a tile action to empty state", () => {
      const actions: PaintAction[] = [{ kind: "tile", x: 0, y: 0, tileType: "ground" }];
      const result = applyPaintActions([], [], actions);
      expect(result.tiles).toHaveLength(1);
      expect(result.tiles[0]).toMatchObject({ x: 0, y: 0, type: "ground" });
      expect(result.entities).toHaveLength(0);
    });

    it("replaces existing tile at same position", () => {
      const tiles: Tile[] = [{ x: 0, y: 0, type: "ground" }];
      const actions: PaintAction[] = [{ kind: "tile", x: 0, y: 0, tileType: "brick" }];
      const result = applyPaintActions(tiles, [], actions);
      expect(result.tiles).toHaveLength(1);
      expect(result.tiles[0].type).toBe("brick");
    });

    it("adds entity action", () => {
      const actions: PaintAction[] = [{ kind: "entity", x: 5, y: 5, entityType: "coin", entityId: "e1" }];
      const result = applyPaintActions([], [], actions);
      expect(result.entities).toHaveLength(1);
      expect(result.entities[0]).toMatchObject({ id: "e1", type: "coin", position: { x: 5, y: 5 } });
    });

    it("does not add duplicate player entity (unique)", () => {
      const entities: Entity[] = [{ id: "p1", type: "player", position: { x: 0, y: 0 }, properties: {} }];
      const actions: PaintAction[] = [
        { kind: "entity", x: 10, y: 10, entityType: "player", entityId: "p2" },
      ];
      const result = applyPaintActions([], entities, actions);
      expect(result.entities).toHaveLength(1);
      expect(result.entities[0].id).toBe("p1");
    });

    it("does not add duplicate goal entity (unique)", () => {
      const entities: Entity[] = [{ id: "g1", type: "goal", position: { x: 0, y: 0 }, properties: {} }];
      const actions: PaintAction[] = [
        { kind: "entity", x: 20, y: 20, entityType: "goal", entityId: "g2" },
      ];
      const result = applyPaintActions([], entities, actions);
      expect(result.entities).toHaveLength(1);
    });

    it("allows multiple non-unique entities (coins)", () => {
      const actions: PaintAction[] = [
        { kind: "entity", x: 0, y: 0, entityType: "coin", entityId: "c1" },
        { kind: "entity", x: 1, y: 0, entityType: "coin", entityId: "c2" },
        { kind: "entity", x: 2, y: 0, entityType: "coin", entityId: "c3" },
      ];
      const result = applyPaintActions([], [], actions);
      expect(result.entities).toHaveLength(3);
    });

    it("erases tile and entity at same position", () => {
      const tiles: Tile[] = [{ x: 0, y: 0, type: "ground" }];
      const entities: Entity[] = [
        { id: "e1", type: "coin", position: { x: 0, y: 0 }, properties: {} },
      ];
      const actions: PaintAction[] = [{ kind: "erase", x: 0, y: 0 }];
      const result = applyPaintActions(tiles, entities, actions);
      expect(result.tiles).toHaveLength(0);
      expect(result.entities).toHaveLength(0);
    });

    it("erasing a unique entity allows placing it again", () => {
      const entities: Entity[] = [{ id: "p1", type: "player", position: { x: 0, y: 0 }, properties: {} }];
      const actions: PaintAction[] = [
        { kind: "erase", x: 0, y: 0 },
        { kind: "entity", x: 5, y: 5, entityType: "player", entityId: "p2" },
      ];
      const result = applyPaintActions([], entities, actions);
      expect(result.entities).toHaveLength(1);
      expect(result.entities[0].id).toBe("p2");
    });

    it("applies multiple actions in sequence, removing conflicts", () => {
      const actions: PaintAction[] = [
        { kind: "tile", x: 0, y: 0, tileType: "ground" },
        { kind: "tile", x: 1, y: 0, tileType: "ground" },
        { kind: "entity", x: 0, y: 0, entityType: "coin", entityId: "c1" },
        { kind: "entity", x: 2, y: 0, entityType: "enemy", entityId: "en1" },
      ];
      const result = applyPaintActions([], [], actions);
      expect(result.tiles).toHaveLength(1);
      expect(result.entities).toHaveLength(2);
      expect(result.tiles[0]).toMatchObject({ x: 1, y: 0 });
    });

    it("handles empty actions array", () => {
      const result = applyPaintActions([], [], []);
      expect(result.tiles).toHaveLength(0);
      expect(result.entities).toHaveLength(0);
    });

    it("preserves existing tiles and entities not affected by actions", () => {
      const tiles: Tile[] = [{ x: 10, y: 10, type: "ground" }];
      const entities: Entity[] = [
        { id: "e1", type: "coin", position: { x: 20, y: 20 }, properties: {} },
      ];
      const actions: PaintAction[] = [{ kind: "tile", x: 0, y: 0, tileType: "brick" }];
      const result = applyPaintActions(tiles, entities, actions);
      expect(result.tiles).toHaveLength(2);
      expect(result.entities).toHaveLength(1);
    });
  });

  describe("isUniqueEntity", () => {
    it("returns false for player", () => {
      expect(isUniqueEntity("player")).toBe(false);
    });

    it("returns false for goal", () => {
      expect(isUniqueEntity("goal")).toBe(false);
    });

    it("returns true for coin", () => {
      expect(isUniqueEntity("coin")).toBe(true);
    });

    it("returns true for enemy", () => {
      expect(isUniqueEntity("enemy")).toBe(true);
    });

    it("returns true for checkpoint", () => {
      expect(isUniqueEntity("checkpoint")).toBe(true);
    });

    it("returns true for door", () => {
      expect(isUniqueEntity("door")).toBe(true);
    });

    it("returns true for key", () => {
      expect(isUniqueEntity("key")).toBe(true);
    });
  });
});
