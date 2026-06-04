import { z } from "zod";

export const tileSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  type: z.enum(["ground", "spike"]),
});

export const entitySchema = z.object({
  id: z.string().min(1),
  type: z.enum(["player", "coin", "enemy", "goal"]),
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
