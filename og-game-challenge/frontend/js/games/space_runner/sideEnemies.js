import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config.js";

export class SideEnemy {
  constructor(level = 1) {
    this.width = 40;
    this.height = 28;

    this.direction = Math.random() < 0.5 ? 1 : -1;

    this.x = this.direction === 1 ? -this.width : CANVAS_WIDTH;
    this.y = CANVAS_HEIGHT / 3 + Math.random() * (CANVAS_HEIGHT * 2 / 3 - this.height);

    this.speed = 0.55 + level * 0.03;
    this.active = true;

    this.state = "moving_in";
    this.shotsFired = 0;
    this.shootTimer = 15;
    this.pauseTimer = 120;

    const minStop = CANVAS_WIDTH * 0.05;
    const maxStop = CANVAS_WIDTH * 0.30;

    if (this.direction === 1) {
      this.stopX = minStop + Math.random() * (maxStop - minStop);
    } else {
      this.stopX = CANVAS_WIDTH - maxStop + Math.random() * (maxStop - minStop);
    }
  }

  update() {
    if (this.state === "moving_in") {
      this.x += this.speed * this.direction;

      if (
        (this.direction === 1 && this.x >= this.stopX) ||
        (this.direction === -1 && this.x <= this.stopX)
      ) {
        this.state = "attacking";
      }

      return;
    }

    if (this.state === "attacking") {
      this.pauseTimer--;

      if (this.pauseTimer <= 0 && this.shotsFired >= 3) {
        this.state = "moving_out";
      }

      return;
    }

    if (this.state === "moving_out") {
      this.x += this.speed * this.direction;

      if (this.x > CANVAS_WIDTH + this.width || this.x < -this.width * 2) {
        this.active = false;
      }
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    if (this.direction === -1) {
      ctx.scale(-1, 1);
    }

    const w = this.width;
    const h = this.height;

    // ═══════════════════════════════════════
    // COQUE PRINCIPALE
    // ═══════════════════════════════════════

    const hull = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    hull.addColorStop(0, "#123c66");
    hull.addColorStop(0.5, "#10243d");
    hull.addColorStop(1, "#050d20");

    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(-w / 2, -h / 2);
    ctx.lineTo(-w / 3, 0);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();

    ctx.fillStyle = hull;
    ctx.fill();

    // Contour néon
    ctx.shadowColor = "#00aaff";
    ctx.shadowBlur = 2;
    ctx.strokeStyle = "#00bbff";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ═══════════════════════════════════════
    // BLINDAGE MÉTALLIQUE
    // ═══════════════════════════════════════

    ctx.fillStyle = "#8c929e";

    // Aileron supérieur
    ctx.beginPath();
    ctx.moveTo(-w * 0.36, -h * 0.38);
    ctx.lineTo(w * 0.18, -h * 0.12);
    ctx.lineTo(-w * 0.14, -h * 0.08);
    ctx.closePath();
    ctx.fill();

    // Aileron inférieur
    ctx.beginPath();
    ctx.moveTo(-w * 0.36, h * 0.38);
    ctx.lineTo(w * 0.18, h * 0.12);
    ctx.lineTo(-w * 0.14, h * 0.08);
    ctx.closePath();
    ctx.fill();

    // Plaque centrale
    ctx.fillStyle = "#333946";
    ctx.beginPath();
    ctx.moveTo(-w * 0.22, -h * 0.15);
    ctx.lineTo(w * 0.32, 0);
    ctx.lineTo(-w * 0.22, h * 0.15);
    ctx.closePath();
    ctx.fill();

    // ═══════════════════════════════════════
    // NOYAU ÉNERGÉTIQUE
    // ═══════════════════════════════════════

    const coreX = -w * 0.08;
    const coreRadius = 4.5;

    ctx.shadowColor = "#00aaff";
    ctx.shadowBlur = this.state === "attacking" ? 5 : 2;

    ctx.beginPath();
    ctx.arc(coreX, 0, coreRadius + 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#003366";
    ctx.fill();

    const core = ctx.createRadialGradient(
      coreX - 1, -1, 0,
      coreX, 0, coreRadius
    );

    core.addColorStop(0, "#ffffff");
    core.addColorStop(0.35, "#aaddff");
    core.addColorStop(0.75, "#00aaff");
    core.addColorStop(1, "#0055aa");

    ctx.beginPath();
    ctx.arc(coreX, 0, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    ctx.shadowBlur = 0;

    // ═══════════════════════════════════════
    // DÉTAILS LUMINEUX
    // ═══════════════════════════════════════

    ctx.strokeStyle = "#66ddff";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(-w * 0.33, -h * 0.3);
    ctx.lineTo(w * 0.12, -h * 0.1);

    ctx.moveTo(-w * 0.33, h * 0.3);
    ctx.lineTo(w * 0.12, h * 0.1);
    ctx.stroke();

    ctx.restore();
  }
}