import { Player } from "./player.js";
import { StarBackground } from "./background.js";
import { keys } from "./input.js";
import { Bullet } from "./bullets.js";

export class Game {
  constructor(canvas, scoreElement, messageElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.scoreElement = scoreElement;
    this.messageElement = messageElement;

    this.player = new Player();
    this.background = new StarBackground();

    this.bullets = [];
    this.shootCooldown = 0;

    this.score = 0;
    this.isRunning = false;
    this.animationId = null;
  }

  start() {
    this.score = 0;
    this.scoreElement.textContent = this.score;
    this.messageElement.textContent = "";

    this.player.reset();
    this.isRunning = true;

    this.bullets = [];
    this.shootCooldown = 0;

    cancelAnimationFrame(this.animationId);
    this.loop();
  }

  update() {
    this.background.update();
    this.player.update();
    this.updateShooting();
    this.updateBullets();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw(this.ctx);
    this.player.draw(this.ctx);
    for (const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }
  }

  loop() {
    if (!this.isRunning) {
      return;
    }

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }
  
  updateShooting() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    if (keys.shoot && this.shootCooldown === 0) {
      this.bullets.push(new Bullet(this.player.x, this.player.y));
      this.shootCooldown = 12;
    }
  }

  updateBullets() {
    for (const bullet of this.bullets) {
      bullet.update();
    }

    this.bullets = this.bullets.filter((bullet) => bullet.active);
  }
}
