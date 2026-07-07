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
  const x = this.x;
  const y = this.y;
  const s = this.width / 2;

  ctx.save();
  ctx.translate(x, y);

  // Corps principal
  ctx.fillStyle = "#e6f1ff";
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(-s, s * 0.9);
  ctx.lineTo(0, s * 0.45);
  ctx.lineTo(s, s * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Partie centrale
  ctx.fillStyle = "#b8c7d9";
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.75);
  ctx.lineTo(-s * 0.35, s * 0.55);
  ctx.lineTo(0, s * 0.35);
  ctx.lineTo(s * 0.35, s * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cockpit
  ctx.fillStyle = "#00cfff";
  ctx.strokeStyle = "#003344";

  ctx.beginPath();
  ctx.moveTo(0, -s * 0.45);
  ctx.lineTo(-s * 0.18, s * 0.15);
  ctx.lineTo(0, s * 0.35);
  ctx.lineTo(s * 0.18, s * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Ailes latérales sombres
  ctx.fillStyle = "#2c3440";

  ctx.beginPath();
  ctx.moveTo(-s * 0.55, s * 0.25);
  ctx.lineTo(-s * 0.95, s * 0.75);
  ctx.lineTo(-s * 0.25, s * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(s * 0.55, s * 0.25);
  ctx.lineTo(s * 0.95, s * 0.75);
  ctx.lineTo(s * 0.25, s * 0.55);
  ctx.closePath();
  ctx.fill();

  // Réacteurs
  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(-s * 0.45, s * 0.82, s * 0.22, s * 0.45);
  ctx.fillRect(s * 0.23, s * 0.82, s * 0.22, s * 0.45);

  // Flammes
  ctx.fillStyle = "#008cff";
  ctx.beginPath();
  ctx.moveTo(-s * 0.34, s * 1.35);
  ctx.lineTo(-s * 0.48, s * 0.95);
  ctx.lineTo(-s * 0.2, s * 0.95);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(s * 0.34, s * 1.35);
  ctx.lineTo(s * 0.2, s * 0.95);
  ctx.lineTo(s * 0.48, s * 0.95);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
}
