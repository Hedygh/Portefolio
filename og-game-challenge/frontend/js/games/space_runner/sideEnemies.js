import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config.js";

export class SideEnemy {
  constructor(level = 1) {
    this.width = 40;
    this.height = 28;

    this.direction = Math.random() < 0.5 ? 1 : -1;

    this.x = this.direction === 1 ? -this.width : CANVAS_WIDTH;
    const lowerTwoThirdsStart = CANVAS_HEIGHT / 3;
    // Enemies spawn seulement aux 2tiers du bas de l'écran
    this.y = lowerTwoThirdsStart + Math.random() * (CANVAS_HEIGHT - lowerTwoThirdsStart - this.height);

    this.speed = 2 + level * 0.08;
    this.active = true;
  }

  update() {
    this.x += this.speed * this.direction;

    if (this.x > CANVAS_WIDTH + this.width || this.x < -this.width * 2) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    if (this.direction === -1) {
      ctx.scale(-1, 1);
    }

    ctx.fillStyle = "#002244";
    ctx.strokeStyle = "#00aaff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(-this.width / 2, -this.height / 2);
    ctx.lineTo(-this.width / 3, 0);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#00aaff";
    ctx.fillRect(-6, -4, 12, 8);

    ctx.restore();
  }
}