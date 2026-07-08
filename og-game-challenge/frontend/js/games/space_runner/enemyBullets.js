import { CANVAS_WIDTH } from "./config.js";

export class EnemyBullet {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;

    this.width = 14;
    this.height = 6;

    this.direction = direction;

    this.speed = 2.2;
    this.active = true;
  }

  update() {
    this.x += this.speed * this.direction;

    if (
       this.x < -this.width ||
       this.x > CANVAS_WIDTH + this.width
    ) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(
    this.x,
    this.y - 2,
    16,
    4
    );
  }
}