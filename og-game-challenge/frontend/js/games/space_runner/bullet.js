export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 14;
    this.speed = 8;
    this.active = true;
  }

  update() {
    this.y -= this.speed;

    if (this.y + this.height < 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#00ff66";
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
  }
}