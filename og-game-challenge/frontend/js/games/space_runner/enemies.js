import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config.js";

export class Enemy {
  constructor() {
    this.width = 34;
    this.height = 34;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = -this.height;
    this.speed = 2;
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

    ctx.fillStyle = "#220000";
    ctx.strokeStyle = "#ff3333";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, -this.height / 3);
    ctx.lineTo(0, -this.height / 6);
    ctx.lineTo(this.width / 2, -this.height / 3);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ff3333";
    ctx.fillRect(-4, -4, 8, 12);

    ctx.restore();
  }
}
