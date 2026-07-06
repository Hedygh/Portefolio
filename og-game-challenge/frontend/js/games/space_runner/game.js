import { Player } from "./player.js";
import { StarBackground } from "./background.js";

export class Game {
  constructor(canvas, scoreElement, messageElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.scoreElement = scoreElement;
    this.messageElement = messageElement;

    this.player = new Player();
    this.background = new StarBackground();

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

    cancelAnimationFrame(this.animationId);
    this.loop();
  }

  update() {
    this.background.update();
    this.player.update();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw(this.ctx);
    this.player.draw(this.ctx);
  }

  loop() {
    if (!this.isRunning) {
      return;
    }

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
