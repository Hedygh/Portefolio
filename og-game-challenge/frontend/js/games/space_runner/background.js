import { CANVAS_WIDTH, CANVAS_HEIGHT, STAR_COUNT } from "./config.js";

export class StarBackground {
  constructor() {
    this.stars = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      this.stars.push(this.createStar());
    }
  }

  createStar() {
    return {
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1.5 + 0.5
    };
  }

  update() {
    for (const star of this.stars) {
      star.y += star.speed;

      if (star.y > CANVAS_HEIGHT) {
        star.x = Math.random() * CANVAS_WIDTH;
        star.y = 0;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#ffffff";

    for (const star of this.stars) {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}
