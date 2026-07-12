import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from "./config.js";

export class DragonLaser {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;

    this.length =
      Math.hypot(CANVAS_WIDTH, CANVAS_HEIGHT) * 1.3;

    this.width = 9;
    this.active = true;

    this.state = "warning";

    this.warningTimer = 45;
    this.activeTimer = 40;
    this.fadeTimer = 18;
  }

  update() {
    if (this.state === "warning") {
      this.warningTimer--;

      if (this.warningTimer <= 0) {
        this.state = "active";
      }

      return;
    }

    if (this.state === "active") {
      this.activeTimer--;

      if (this.activeTimer <= 0) {
        this.state = "fading";
      }

      return;
    }

    if (this.state === "fading") {
      this.fadeTimer--;

      if (this.fadeTimer <= 0) {
        this.active = false;
      }
    }
  }

  isDangerous() {
    return this.state === "active";
  }

  isCollidingWith(hitbox) {
    if (!this.isDangerous()) {
      return false;
    }

    const centerX =
      hitbox.x + hitbox.width / 2;

    const centerY =
      hitbox.y + hitbox.height / 2;

    const dx = centerX - this.x;
    const dy = centerY - this.y;

    const perpendicularDistance =
      Math.abs(
        -Math.sin(this.angle) * dx +
        Math.cos(this.angle) * dy
      );

    const alongLaser =
      Math.cos(this.angle) * dx +
      Math.sin(this.angle) * dy;

    const playerRadius =
      Math.max(hitbox.width, hitbox.height) / 2;

    return (
      perpendicularDistance <=
        this.width / 2 + playerRadius &&
      alongLaser >= 0 &&
      alongLaser <= this.length
    );
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.state === "warning") {
      const blink =
        0.2 +
        Math.abs(Math.sin(this.warningTimer * 0.25)) *
          0.35;

      ctx.globalAlpha = blink;
      ctx.strokeStyle = "#ff674d";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.length, 0);
      ctx.stroke();
    }

    if (this.state === "active") {
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = "#ff210d";
      ctx.lineWidth = this.width + 14;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.length, 0);
      ctx.stroke();

      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = "#ff3a16";
      ctx.lineWidth = this.width;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.length, 0);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#fff1cf";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.length, 0);
      ctx.stroke();
    }

    if (this.state === "fading") {
      ctx.globalAlpha =
        this.fadeTimer / 18;

      ctx.strokeStyle = "#ff3a16";
      ctx.lineWidth = this.width;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.length, 0);
      ctx.stroke();
    }

    ctx.restore();
  }
}
