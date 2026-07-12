import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from "./config.js";

export class DragonFireball {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;

    this.targetX = targetX;
    this.targetY = targetY;

    this.radius = 15;
    this.width = this.radius * 2;
    this.height = this.radius * 2;

    this.speed = 4.2;
    this.active = true;

    this.state = "flying";

    // Environ 3 secondes à 60 FPS.
    this.burnTimer = 180;
    this.animationFrame = 0;

    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
      this.vx = 0;
      this.vy = this.speed;
    } else {
      this.vx = (dx / distance) * this.speed;
      this.vy = (dy / distance) * this.speed;
    }
  }

  update() {
    this.animationFrame++;

    if (this.state === "flying") {
      this.updateFlying();
      return;
    }

    if (this.state === "burning") {
      this.updateBurning();
    }
  }

  updateFlying() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const remainingDistance = Math.hypot(dx, dy);

    if (remainingDistance <= this.speed) {
      this.x = this.targetX;
      this.y = this.targetY;

      this.state = "burning";
      this.radius = 16;

      this.updateHitbox();
      return;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.updateHitbox();
  }

  updateBurning() {
    this.burnTimer--;

    if (this.burnTimer <= 0) {
      this.active = false;
    }

    this.updateHitbox();
  }

  updateHitbox() {
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }

  getHitbox() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }

  draw(ctx) {
    if (this.state === "flying") {
      this.drawFlying(ctx);
      return;
    }

    this.drawBurning(ctx);
  }

  drawFlying(ctx) {
    ctx.save();

    ctx.shadowColor = "#27bfff";
    ctx.shadowBlur = 7;

    ctx.fillStyle = "#1565c0";
    ctx.strokeStyle = "#8de8ff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#d9f8ff";

    ctx.beginPath();
    ctx.arc(
      this.x - 2,
      this.y - 2,
      this.radius * 0.35,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  drawBurning(ctx) {
    const pulse =
      Math.sin(this.animationFrame * 0.18) * 3;

    const flameRadius = this.radius + pulse;

    ctx.save();

    ctx.globalAlpha = Math.min(
      1,
      this.burnTimer / 30
    );

    ctx.fillStyle = "#0d47a1";
    ctx.strokeStyle = "#4ddfff";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
      this.x,
      this.y - flameRadius * 1.4
    );

    ctx.quadraticCurveTo(
      this.x - flameRadius,
      this.y,
      this.x,
      this.y + flameRadius
    );

    ctx.quadraticCurveTo(
      this.x + flameRadius,
      this.y,
      this.x,
      this.y - flameRadius * 1.4
    );

    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#9ef3ff";

    ctx.beginPath();

    ctx.moveTo(
      this.x,
      this.y - flameRadius * 0.65
    );

    ctx.quadraticCurveTo(
      this.x - flameRadius * 0.35,
      this.y,
      this.x,
      this.y + flameRadius * 0.45
    );

    ctx.quadraticCurveTo(
      this.x + flameRadius * 0.35,
      this.y,
      this.x,
      this.y - flameRadius * 0.65
    );

    ctx.fill();

    ctx.restore();
  }
}