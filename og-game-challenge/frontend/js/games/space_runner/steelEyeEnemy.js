import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from "./config.js";

export class SteelEyeEnemy {
  constructor(level = 11) {
    this.width = 48;
    this.height = 48;

    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = -this.height;

    this.stopY =
      CANVAS_HEIGHT * (0.05 + Math.random() * 0.10);

    this.speed = 1.2;
    this.chargeSpeed = 7 + (level - 11) * 0.35;

    this.health = 6;
    this.maxHealth = 6;

    this.active = true;
    this.state = "descending";

    this.waitTimer = 60;
    this.armingTimer = 75;

    this.spikeProgress = 0;
    this.eyeIntensity = 0;

    this.vx = 0;
    this.vy = 0;
  }

  update(player) {
    if (this.state === "descending") {
      this.updateDescending();
      return;
    }

    if (this.state === "waiting") {
      this.updateWaiting();
      return;
    }

    if (this.state === "arming") {
      this.updateArming(player);
      return;
    }

    if (this.state === "charging") {
      this.updateCharging();
    }
  }

  updateDescending() {
    this.y += this.speed;

    if (this.y >= this.stopY) {
      this.y = this.stopY;
      this.state = "waiting";
    }
  }

  updateWaiting() {
    this.waitTimer--;

    this.eyeIntensity =
      0.4 + Math.sin(this.waitTimer * 0.15) * 0.2;

    if (this.waitTimer <= 0) {
      this.state = "arming";
    }
  }

  updateArming(player) {
    this.armingTimer--;

    this.spikeProgress = Math.min(
      1,
      this.spikeProgress + 0.025
    );

    this.eyeIntensity =
      0.65 + Math.sin(this.armingTimer * 0.35) * 0.35;

    if (this.armingTimer <= 0) {
      this.startCharge(player);
    }
  }

  startCharge(player) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    const dx = player.x - centerX;
    const dy = player.y - centerY;

    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
      this.vx = 0;
      this.vy = this.chargeSpeed;
    } else {
      this.vx = (dx / distance) * this.chargeSpeed;
      this.vy = (dy / distance) * this.chargeSpeed;
    }

    this.state = "charging";
  }

  updateCharging() {
    this.x += this.vx;
    this.y += this.vy;

    const margin = 100;

    if (
      this.x < -margin ||
      this.x > CANVAS_WIDTH + margin ||
      this.y < -margin ||
      this.y > CANVAS_HEIGHT + margin
    ) {
      this.active = false;
    }
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = this.width / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    if (this.spikeProgress > 0) {
      this.drawSpikes(ctx, radius);
    }

    ctx.fillStyle = "#050505";
    ctx.strokeStyle = "#aeb7c2";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (
      this.state === "waiting" ||
      this.state === "arming" ||
      this.state === "charging"
    ) {
      this.drawEye(ctx, radius);
    }

    ctx.restore();
  }

  drawEye(ctx, radius) {
    ctx.save();

    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 14 * this.eyeIntensity;

    ctx.fillStyle = "#4a0000";
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radius * 0.42,
      radius * 0.2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#ff2222";
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      radius * 0.12,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  drawSpikes(ctx, radius) {
    const spikeCount = 7;

    ctx.fillStyle = "#c6ccd4";
    ctx.strokeStyle = "#59616b";
    ctx.lineWidth = 1;

    for (let i = 0; i < spikeCount; i++) {
      const angle =
        (Math.PI * 2 * i) / spikeCount;

      ctx.save();
      ctx.rotate(angle);

      const spikeLength =
        radius + 22 * this.spikeProgress;

      ctx.beginPath();
      ctx.moveTo(radius * 0.7, -5);
      ctx.lineTo(spikeLength, 0);
      ctx.lineTo(radius * 0.7, 5);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }
}