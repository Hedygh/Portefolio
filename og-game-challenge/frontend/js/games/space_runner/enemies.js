import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config.js";

export class Enemy {
  constructor(level = 1) {
    this.width = 34;
    this.height = 34;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = -this.height;

    this.speed = 2 + level * 0.25;
    this.active = true;
  }

  update() {
    this.y += this.speed;

    if (this.y > CANVAS_HEIGHT) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    const w = this.width;
    const h = this.height;

    // ═══════════════════════════════════════
    // COQUE PRINCIPALE
    // ═══════════════════════════════════════

    const hull = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    hull.addColorStop(0, "#8a3038");
    hull.addColorStop(0.4, "#30141d");
    hull.addColorStop(1, "#10080e");

    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(-w / 2, -h / 3);
    ctx.lineTo(0, -h / 6);
    ctx.lineTo(w / 2, -h / 3);
    ctx.closePath();

    ctx.fillStyle = hull;
    ctx.fill();

    // Contour néon
    ctx.shadowColor = "#ff3333";
    ctx.shadowBlur = 2;
    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ═══════════════════════════════════════
    // BLINDAGE MÉTALLIQUE
    // ═══════════════════════════════════════

    ctx.fillStyle = "#8c929e";

    // Aileron gauche
    ctx.beginPath();
    ctx.moveTo(-w * 0.38, -h * 0.25);
    ctx.lineTo(-w * 0.12, -h * 0.12);
    ctx.lineTo(-w * 0.06, h * 0.2);
    ctx.closePath();
    ctx.fill();

    // Aileron droit
    ctx.beginPath();
    ctx.moveTo(w * 0.38, -h * 0.25);
    ctx.lineTo(w * 0.12, -h * 0.12);
    ctx.lineTo(w * 0.06, h * 0.2);
    ctx.closePath();
    ctx.fill();

    // Plaque centrale
    ctx.fillStyle = "#333946";
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.22);
    ctx.lineTo(-w * 0.13, h * 0.2);
    ctx.lineTo(0, h * 0.38);
    ctx.lineTo(w * 0.13, h * 0.2);
    ctx.closePath();
    ctx.fill();

    // ═══════════════════════════════════════
    // NOYAU ÉNERGÉTIQUE
    // ═══════════════════════════════════════

    const coreY = -h * 0.02;
    const coreRadius = 4.5;

    ctx.shadowColor = "#ff2222";
    ctx.shadowBlur = 6;

    ctx.beginPath();
    ctx.arc(0, coreY, coreRadius + 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#650d17";
    ctx.fill();

    const core = ctx.createRadialGradient(
      -1, coreY - 1, 0,
      0, coreY, coreRadius
    );

    core.addColorStop(0, "#ffffff");
    core.addColorStop(0.35, "#ffaaaa");
    core.addColorStop(0.75, "#ff3333");
    core.addColorStop(1, "#aa0011");

    ctx.beginPath();
    ctx.arc(0, coreY, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    ctx.shadowBlur = 0;

    // ═══════════════════════════════════════
    // DÉTAILS LUMINEUX
    // ═══════════════════════════════════════

    ctx.strokeStyle = "#ff7777";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(-w * 0.32, -h * 0.23);
    ctx.lineTo(-w * 0.14, -h * 0.12);

    ctx.moveTo(w * 0.32, -h * 0.23);
    ctx.lineTo(w * 0.14, -h * 0.12);
    ctx.stroke();

    ctx.restore();
  }
}
