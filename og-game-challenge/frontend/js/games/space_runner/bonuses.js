export const BONUS_TYPES = {
  DOUBLE_SHOT: "double_shot",
  TRIPLE_SHOT: "triple_shot"
};

export class Bonus {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 28;
    this.speed = 2;
    this.type = type;
    this.active = true;
  }

  update() {
    this.y += this.speed;

    if (this.y > 500) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = this.type === BONUS_TYPES.DOUBLE_SHOT ? "#00ff66" : "#ffcc00";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#000";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      this.type === BONUS_TYPES.DOUBLE_SHOT ? "II" : "III",
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    ctx.restore();
  }
}