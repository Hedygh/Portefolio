import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "./config.js";

import { keys } from "./input.js";

export class Player {
  constructor() {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.speed = PLAYER_SPEED;

    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - 70;
  }

  reset() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - 70;
  }

  update() {
    if (keys.left && this.x - this.width / 2 > 0) {
      this.x -= this.speed;
    }

    if (keys.right && this.x + this.width / 2 < CANVAS_WIDTH) {
      this.x += this.speed;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#d8d8d8";
    ctx.strokeStyle = "#00ff66";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.width / 2, this.y + this.height);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // cockpit simple
    ctx.fillStyle = "#111";
    ctx.fillRect(this.x - 5, this.y + 18, 10, 16);
  }
}
