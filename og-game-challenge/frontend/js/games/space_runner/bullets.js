export class Bullet {
  constructor(x, y, weaponLevel = 1) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 14;
    this.speed = 8;
    this.active = true;

    this.weaponLevel = weaponLevel;
  }

  update() {
    this.y -= this.speed;

    if (this.y + this.height < 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    const triple = this.weaponLevel >= 3;

    ctx.save();

    ctx.fillStyle = triple ? "#bb44ff" : "#00ff66";

    if (triple) {
      ctx.shadowColor = "#bb44ff";
      ctx.shadowBlur = 8;
    }

    ctx.fillRect(
      this.x - this.width / 2,
      this.y,
      this.width,
      this.height
    );

    ctx.restore();
  }
}