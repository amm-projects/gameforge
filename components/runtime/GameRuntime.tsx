"use client";

import { useEffect, useRef } from "react";
import type { GameObjects, Physics, Types } from "phaser";
import type { LevelData, Tile, Entity } from "@/types/level";

const TILE_SIZE = 32;

export function GameRuntime({ level, onStop }: { level: LevelData; onStop: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    let game: any = null;

    const initializeGame = async () => {
      const PhaserLib = await import("phaser");

      class RuntimeScene extends PhaserLib.Scene {
        declare level: LevelData;
        declare cursors: Types.Input.Keyboard.CursorKeys;
        declare player?: Physics.Arcade.Sprite;
        declare statusText?: GameObjects.Text;

        constructor() {
          super({ key: "runtime" });
        }

        init(data: { level: LevelData }) {
          this.level = data.level;
        }

        create() {
          const { width, height, tiles, entities } = this.level;
          const worldWidth = width * TILE_SIZE;
          const worldHeight = height * TILE_SIZE;

          const graphics = this.add.graphics();
          graphics.fillStyle(0xffffff, 1);
          graphics.fillRect(0, 0, 1, 1);
          graphics.generateTexture("pixel", 1, 1);
          graphics.destroy();

          this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
          this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

          const solidLayer = this.physics.add.staticGroup();
          const spikeLayer = this.physics.add.staticGroup();
          const goalLayer = this.physics.add.staticGroup();
          const coinLayer = this.physics.add.staticGroup();
          const enemyLayer = this.physics.add.group({ bounceX: 1, collideWorldBounds: true });

          tiles.forEach((tile: Tile) => {
            const x = tile.x * TILE_SIZE;
            const y = tile.y * TILE_SIZE;
            if (tile.type === "ground") {
              solidLayer
                .create(x + 16, y + 16, "pixel")
                .setOrigin(0.5)
                .setDisplaySize(TILE_SIZE, TILE_SIZE)
                .setTint(0x5d432f);
            }
            if (tile.type === "spike") {
              spikeLayer
                .create(x + 16, y + 16, "pixel")
                .setOrigin(0.5)
                .setDisplaySize(TILE_SIZE, TILE_SIZE)
                .setTint(0xdc2626);
            }
          });

          entities.forEach((entity: Entity) => {
            const x = entity.x * TILE_SIZE + 16;
            const y = entity.y * TILE_SIZE + 16;

            if (entity.type === "player") {
              this.player = this.physics.add.sprite(x, y, "pixel").setDisplaySize(28, 28).setTint(0x2563eb);
              this.player.setBounce(0.1);
              this.player.setCollideWorldBounds(true);
              const body = this.player.body as Physics.Arcade.Body;
              body.setSize(28, 28);
              body.setOffset(0, 0);
            }

            if (entity.type === "coin") {
              coinLayer
                .create(x, y, "pixel")
                .setOrigin(0.5)
                .setDisplaySize(18, 18)
                .setTint(0xf59e0b);
            }

            if (entity.type === "goal") {
              goalLayer
                .create(x, y, "pixel")
                .setOrigin(0.5)
                .setDisplaySize(26, 26)
                .setTint(0x22c55e);
            }

            if (entity.type === "enemy") {
              const enemy = this.physics.add.sprite(x, y, "pixel");
              enemy.setDisplaySize(26, 26).setTint(0xea580c);
              enemy.setVelocityX(80);
              enemy.body.setAllowGravity(true);
              enemyLayer.add(enemy);
            }
          });

          if (!this.player) {
            this.add.text(16, 16, "Place a player to start", { fontSize: "18px", color: "#ffffff" });
          }

          if (this.player) {
            this.physics.add.collider(this.player, solidLayer);
            this.physics.add.collider(this.player, spikeLayer, () => this.onHitSpike(), undefined, this);
            this.physics.add.overlap(
              this.player,
              coinLayer,
              (_player, coin) => {
                this.onCollectCoin(coin as Types.Physics.Arcade.GameObjectWithBody);
              },
              undefined,
              this
            );
            this.physics.add.overlap(this.player, goalLayer, () => this.onReachGoal(), undefined, this);
            this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
          }

          this.physics.add.collider(enemyLayer, solidLayer);
          if (this.player) {
            this.physics.add.collider(this.player, enemyLayer, () => this.onHitSpike(), undefined, this);
          }

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.statusText = this.add
            .text(16, worldHeight + 16, "", { fontSize: "16px", color: "#ffffff" })
            .setScrollFactor(0);
        }

        update() {
          if (!this.player) {
            return;
          }

          if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-160);
          } else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(160);
          } else {
            this.player.setVelocityX(0);
          }

          if (this.cursors.up?.isDown && (this.player.body as Physics.Arcade.Body).blocked.down) {
            this.player.setVelocityY(-320);
          }
        }

        private onCollectCoin(coin: Types.Physics.Arcade.GameObjectWithBody) {
          coin.destroy();
        }

        private onHitSpike() {
          if (this.statusText) {
            this.statusText.setText("Game Over");
          }
          this.scene.pause();
        }

        private onReachGoal() {
          if (this.statusText) {
            this.statusText.setText("Nivel completado");
          }
          this.scene.pause();
        }
      }

      game = new PhaserLib.Game({
        type: PhaserLib.AUTO,
        parent: containerRef.current!,
        width: Math.min(level.width * TILE_SIZE, 768),
        height: Math.min(level.height * TILE_SIZE, 480),
        backgroundColor: "#0f172a",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 700 },
            debug: false,
          },
        },
        scene: [RuntimeScene],
      });

      game.scene.start("runtime", { level });
    };

    void initializeGame();

    return () => {
      if (game) {
        game.destroy(true);
      }
      onStop();
    };
  }, [level, onStop]);

  return (
    <section className="mx-auto mt-6 max-w-full rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Runtime Phaser</h2>
          <p className="text-sm text-slate-400">El motor consume el nivel JSON y usa física arcade simple.</p>
        </div>
        <button
          type="button"
          onClick={onStop}
          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
        >
          Detener
        </button>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-900/80 bg-black" ref={containerRef} />
    </section>
  );
}
