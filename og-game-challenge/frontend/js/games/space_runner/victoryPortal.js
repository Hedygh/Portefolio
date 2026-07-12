import {
  CANVAS_WIDTH
} from "./config.js";

export class VictoryPortal {
  constructor() {
    this.x = CANVAS_WIDTH / 2;
    this.y = 65;

    this.radius = 0;
    this.maxRadius = 42;

    this.rotation = 0;
    this.active = true;
    this.opened = false;
  }

  update() {
    this.rotation += 0.035;

    if (this.radius < this.maxRadius) {
      this.radius += 0.8;
    } else {
      this.radius = this.maxRadius;
      this.opened = true;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.strokeStyle = "#8d4dff";
    ctx.lineWidth = 7;

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.rotate(-this.rotation * 1.7);

    ctx.strokeStyle = "#37e6ff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius * 0.72,
      0,
      Math.PI * 1.65
    );
    ctx.stroke();

    ctx.fillStyle = "#080016";
    ctx.globalAlpha = 0.88;

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius * 0.62,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}