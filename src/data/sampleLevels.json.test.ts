import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { levelDataSchema } from "@/types/level.schema";

const LEVELS_DIR = join(import.meta.dirname, "..", "..", "public", "levels");

describe("sample level JSON files", () => {
  const files = readdirSync(LEVELS_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    it(`validates ${file} against levelDataSchema`, () => {
      const raw = readFileSync(join(LEVELS_DIR, file), "utf-8");
      const parsed = JSON.parse(raw);
      expect(parsed).toHaveProperty("id");
      expect(parsed).toHaveProperty("name");
      expect(parsed).toHaveProperty("description");
      expect(parsed).toHaveProperty("level");
      const result = levelDataSchema.safeParse(parsed.level);
      if (!result.success) {
        console.error(`Validation errors for ${file}:`, result.error.issues);
      }
      expect(result.success).toBe(true);
    });
  }

  it("has all 4 sample levels", () => {
    expect(files.sort()).toEqual(["empty.json", "sky-fortress.json", "treasure-tower.json", "underground.json"]);
  });
});
