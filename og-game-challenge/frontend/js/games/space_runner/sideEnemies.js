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

    ctx.fillStyle = this.state === "attacking" ? "#003366" : "#002244";
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

    ctx.fillStyle = this.state === "attacking" ? "#ffffff" : "#00aaff";
    ctx.fillRect(-6, -4, 12, 8);

    ctx.restore();
  }
}