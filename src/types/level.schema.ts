import { z } from "zod";

const tileTypeEnum = z.enum(["ground", "brick", "platform", "spike", "spike-up", "spike-down", "spike-left", "spike-right"]);

const moveAxisEnum = z.enum(["none", "horizontal", "vertical"]);

export const tilePropertiesSchema = z.object({
  moveAxis: moveAxisEnum.optional(),
  moveSpeed: z.number().int().min(0).optional(),
  moveRange: z.number().int().min(0).optional(),
}).optional().default({});

export const tileSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  type: tileTypeEnum.transform((v) => (v === "spike" ? "spike-up" : v)),
  solid: z.boolean().optional(),
  collision: z.boolean().optional(),
  properties: tilePropertiesSchema,
});

export const entitySchema = z.object({
  id: z.string().min(1),
  type: z.enum(["player", "coin", "walker", "goal", "checkpoint", "door", "key", "patrol", "jumper", "1up"]),
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
  background: z.enum(["dark", "sky", "forest", "desert", "sunset", "purple"]).optional().default("dark"),
  music: z.enum(["calm", "adventure", "retro", "mystery", "boss"]).optional().default("calm"),
});
