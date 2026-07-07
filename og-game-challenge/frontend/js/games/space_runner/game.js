import { Player } from "./player.js";
import { StarBackground } from "./background.js";
import { keys } from "./input.js";
import { Bullet } from "./bullets.js";
import { Enemy } from "./enemies.js";
import { isColliding } from "./collision.js";

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

    this.enemies = [];
    this.enemySpawnTimer = 0;

    this.score = 0;
    this.isRunning = false;
    this.animationId = null;

    this.explosions = [];
  }

  start() {
    this.score = 0;
    this.scoreElement.textContent = this.score;
    this.messageElement.textContent = "";

    this.player.reset();
    this.isRunning = true;

    this.bullets = [];
    this.shootCooldown = 0;

    this.enemies = [];
    this.enemySpawnTimer = 0;

    this.explosions = [];

    cancelAnimationFrame(this.animationId);
    this.loop();
  }

  update() {
    this.background.update();
    this.player.update();
    this.updateShooting();
    this.updateBullets();
    this.updateEnemies();

    this.checkBulletEnemyCollisions();
    this.checkPlayerEnemyCollisions();
    this.updateExplosions();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw(this.ctx);
    this.player.draw(this.ctx);
    for (const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }
    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }
    this.drawExplosions();
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

  updateEnemies() {
    this.enemySpawnTimer++;

    if (this.enemySpawnTimer >= 60) {
        this.enemies.push(new Enemy());
        this.enemySpawnTimer = 0;
    }

    for (const enemy of this.enemies) {
        enemy.update();
    }

    this.enemies = this.enemies.filter((enemy) => enemy.active);
  }
  checkBulletEnemyCollisions() {
  for (const bullet of this.bullets) {
    for (const enemy of this.enemies) {
      if (isColliding(bullet, enemy)) {
        bullet.active = false;
        enemy.active = false;

        this.score += 100;
        this.scoreElement.textContent = this.score;

        this.explosions.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          radius: 4,
          life: 15
        });

        break;
      }
    }
  }

  this.bullets = this.bullets.filter((bullet) => bullet.active);
  this.enemies = this.enemies.filter((enemy) => enemy.active);
  }

  updateExplosions() {
    for (const explosion of this.explosions) {
      explosion.radius += 2;
      explosion.life--;
    }

    this.explosions = this.explosions.filter((explosion) => explosion.life > 0);
  }

  drawExplosions() {
    for (const explosion of this.explosions) {
      this.ctx.save();

      this.ctx.globalAlpha = explosion.life / 15;
      this.ctx.fillStyle = "#ffcc00";

      this.ctx.beginPath();
      this.ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      this.ctx.fillStyle = "#ff3300";
      this.ctx.beginPath();
      this.ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius / 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  checkPlayerEnemyCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const enemy of this.enemies) {
      if (isColliding(playerHitbox, enemy)) {
        this.endGame();
        break;
      }
    }
  }

  endGame() {
    this.isRunning = false;
    this.messageElement.textContent = `Game Over — Score: ${this.score}`;
  }
}
