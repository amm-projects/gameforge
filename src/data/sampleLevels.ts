import type { LevelData } from "@/types/level";

import emptyJson from "@/data/levels/empty.json";
import skyFortressJson from "@/data/levels/sky-fortress.json";
import undergroundJson from "@/data/levels/underground.json";
import treasureTowerJson from "@/data/levels/treasure-tower.json";

interface SampleLevel {
  id: string;
  name: string;
  description: string;
  level: LevelData;
}

const empty: SampleLevel = emptyJson as SampleLevel;
const skyFortress: SampleLevel = skyFortressJson as SampleLevel;
const underground: SampleLevel = undergroundJson as SampleLevel;
const treasureTower: SampleLevel = treasureTowerJson as SampleLevel;

export const sampleLevels: SampleLevel[] = [
  empty,
  skyFortress,
  underground,
  treasureTower,
];
