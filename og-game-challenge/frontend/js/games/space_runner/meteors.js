import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config.js";

export class Meteor {
  constructor(level = 1) {
    this.size = Math.random() * 18 + 26;
    this.width = this.size;
    this.height = this.size;

    this.x = Math.random() * (CANVAS_WIDTH - this.size);
    this.y = -this.size;

    this.speed = 1.5 + level * 0.18;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.06;

    this.health = this.size > 36 ? 2 : 1;
    this.active = true;
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;

    if (this.y > CANVAS_HEIGHT) {
      this.active = false;
    }
  }

  draw(ctx) {
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;
    const radius = this.size / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);

    ctx.fillStyle = "#3b3b3b";
    ctx.strokeStyle = "#9a9a9a";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -radius);

    ctx.lineTo(radius * 0.75, -radius * 0.45);
    ctx.lineTo(radius * 0.9, radius * 0.25);
    ctx.lineTo(radius * 0.35, radius * 0.85);
    ctx.lineTo(-radius * 0.45, radius * 0.75);
    ctx.lineTo(-radius * 0.9, radius * 0.1);
    ctx.lineTo(-radius * 0.65, -radius * 0.65);

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cratères
    ctx.fillStyle = "#1f1f1f";
    ctx.beginPath();
    ctx.arc(-radius * 0.25, -radius * 0.15, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(radius * 0.3, radius * 0.25, radius * 0.13, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.active = false;
    }
  }
}
