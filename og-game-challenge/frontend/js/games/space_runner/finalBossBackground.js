import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from "./config.js";

export class FinalBossBackground {
  constructor() {
    this.flames = [];

    this.maxFlames = 14;
    this.spawnTimer = 0;
    this.spawnRate = 12;
  }

  update() {
    this.spawnTimer++;

    if (
      this.spawnTimer >= this.spawnRate &&
      this.flames.length < this.maxFlames
    ) {
      this.createFlame();
      this.spawnTimer = 0;
    }

    for (const flame of this.flames) {
      flame.y -= flame.speed;
      flame.x += Math.sin(flame.wave) * flame.drift;

      flame.wave += flame.waveSpeed;
      flame.life--;
      flame.radius *= 0.992;
    }

    this.flames = this.flames.filter(
      (flame) =>
        flame.life > 0 &&
        flame.radius > 1 &&
        flame.y > -50
    );
  }

  createFlame() {
    const colors = [
      "#8a2be2",
      "#d9003f",
      "#39ff88"
    ];

    const color =
      colors[Math.floor(Math.random() * colors.length)];

    this.flames.push({
      x: Math.random() * CANVAS_WIDTH,
      y:
        CANVAS_HEIGHT * 0.2 +
        Math.random() * CANVAS_HEIGHT * 0.8,

      radius: 8 + Math.random() * 18,
      speed: 0.35 + Math.random() * 0.8,

      drift: 0.15 + Math.random() * 0.35,
      wave: Math.random() * Math.PI * 2,
      waveSpeed: 0.025 + Math.random() * 0.04,

      life: 100 + Math.floor(Math.random() * 120),
      maxLife: 220,

      color
    });
  }

  draw(ctx) {
    for (const flame of this.flames) {
      const alpha = Math.min(
        0.65,
        flame.life / flame.maxLife
      );

      ctx.save();

      ctx.globalAlpha = alpha;
      ctx.fillStyle = flame.color;
      ctx.shadowColor = flame.color;
      ctx.shadowBlur = 6;

      ctx.beginPath();

      ctx.moveTo(
        flame.x,
        flame.y - flame.radius * 1.6
      );

      ctx.quadraticCurveTo(
        flame.x - flame.radius,
        flame.y,
        flame.x,
        flame.y + flame.radius
      );

      ctx.quadraticCurveTo(
        flame.x + flame.radius,
        flame.y,
        flame.x,
        flame.y - flame.radius * 1.6
      );

      ctx.fill();

      ctx.globalAlpha = alpha * 0.45;
      ctx.fillStyle = "#ffffff";

      ctx.beginPath();

      ctx.moveTo(
        flame.x,
        flame.y - flame.radius * 0.75
      );

      ctx.quadraticCurveTo(
        flame.x - flame.radius * 0.35,
        flame.y,
        flame.x,
        flame.y + flame.radius * 0.45
      );

      ctx.quadraticCurveTo(
        flame.x + flame.radius * 0.35,
        flame.y,
        flame.x,
        flame.y - flame.radius * 0.75
      );

      ctx.fill();

      ctx.restore();
    }
  }

  reset() {
    this.flames = [];
    this.spawnTimer = 0;
  }
}