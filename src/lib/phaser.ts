let phaserPromise: Promise<typeof import("phaser")> | null = null;

export function preloadPhaser(): Promise<typeof import("phaser")> {
  if (!phaserPromise) {
    phaserPromise = import("phaser");
  }
  return phaserPromise;
}
