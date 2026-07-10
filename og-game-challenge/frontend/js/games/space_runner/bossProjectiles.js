import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config.js";

export class BossProjectile {
  constructor(x, y, angle, speed = 2.2) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.radius = 5;
    this.speed = speed;
    this.active = true;

    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (
      this.x < -20 ||
      this.x > CANVAS_WIDTH + 20 ||
      this.y > CANVAS_HEIGHT + 20
    ) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = "#aa33ff";
    ctx.strokeStyle = "#ff99ff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
