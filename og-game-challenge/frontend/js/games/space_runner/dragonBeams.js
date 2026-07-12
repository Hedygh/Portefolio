import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from "./config.js";

export class DragonBeam {
  constructor(angleOffset = 0) {
    this.angleOffset = angleOffset;

    this.x = 0;
    this.y = 0;

    this.angle = 0;
    this.rotationSpeed = 0.008;

    this.width = 8;
    this.length =
      Math.hypot(CANVAS_WIDTH, CANVAS_HEIGHT) * 1.2;

    this.active = true;
  }

  update(originX, originY, sharedAngle) {
    this.x = originX;
    this.y = originY;

    this.angle =
      sharedAngle + this.angleOffset;
  }

  isCollidingWith(hitbox) {
    const centerX =
      hitbox.x + hitbox.width / 2;

    const centerY =
      hitbox.y + hitbox.height / 2;

    const dx = centerX - this.x;
    const dy = centerY - this.y;

    /*
     * Distance perpendiculaire entre le centre du joueur
     * et la ligne du rayon.
     */
    const perpendicularDistance =
      Math.abs(
        -Math.sin(this.angle) * dx +
        Math.cos(this.angle) * dy
      );

    /*
     * Position du joueur le long de la direction du rayon.
     * Cela évite de considérer une ligne réellement infinie.
     */
    const alongBeam =
      Math.cos(this.angle) * dx +
      Math.sin(this.angle) * dy;

    const playerRadius =
      Math.max(hitbox.width, hitbox.height) / 2;

    return (
      perpendicularDistance <=
        this.width / 2 + playerRadius &&
      Math.abs(alongBeam) <= this.length
    );
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "#ff2020";
    ctx.lineWidth = this.width + 12;

    ctx.beginPath();
    ctx.moveTo(-this.length, 0);
    ctx.lineTo(this.length, 0);
    ctx.stroke();

    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "#ff3030";
    ctx.lineWidth = this.width;

    ctx.beginPath();
    ctx.moveTo(-this.length, 0);
    ctx.lineTo(this.length, 0);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffd1d1";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-this.length, 0);
    ctx.lineTo(this.length, 0);
    ctx.stroke();

    ctx.restore();
  }
}
