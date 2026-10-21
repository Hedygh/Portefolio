export const BONUS_TYPES = {
  DOUBLE_SHOT: "double_shot",
  TRIPLE_SHOT: "triple_shot",
  SHIELD: "shield"
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

    let color;
    let symbol;

    if (this.type === BONUS_TYPES.DOUBLE_SHOT) {
      color = "#00ff66";
      symbol = "II";
    } else if (this.type === BONUS_TYPES.TRIPLE_SHOT) {
      color = "#ffcc00";
      symbol = "III";
    } else if (this.type === BONUS_TYPES.SHIELD) {
      color = "#00ccff";
      symbol = "S";
    }

    ctx.fillStyle = color;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#000";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      symbol,
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    ctx.restore();
  }
}