import { z } from "zod";

const tileTypeEnum = z.enum(["ground", "brick", "platform", "spike", "spike-up", "spike-down", "spike-left", "spike-right"]);

export const tileSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  type: tileTypeEnum.transform((v) => (v === "spike" ? "spike-up" : v)),
  layer: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  solid: z.boolean().optional(),
  properties: z.record(z.string(), z.unknown()).optional().transform((v) => v ?? {}),
});

export const entitySchema = z.object({
  id: z.string().min(1),
  type: z.enum(["player", "coin", "enemy", "goal", "checkpoint", "door", "key"]),
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
  }),
  properties: z.record(z.string(), z.unknown()).optional().transform((v) => v ?? {}),
});

export const levelDataSchema = z.object({
  width: z.number().int().min(1).max(256),
  height: z.number().int().min(1).max(256),
  tiles: z.array(tileSchema),
  entities: z.array(entitySchema),
});
