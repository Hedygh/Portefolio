import { Player } from "./player.js";
import { StarBackground } from "./background.js";
import { keys } from "./input.js";
import { Bullet } from "./bullets.js";
import { Enemy } from "./enemies.js";
import { Meteor } from "./meteors.js";
import { Bonus, BONUS_TYPES } from "./bonuses.js";
import { isColliding } from "./collision.js";
import { SideEnemy } from "./sideEnemies.js";
import { EnemyBullet } from "./enemyBullets.js";

export class Game {
  constructor(canvas, scoreElement, levelElement, messageElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.scoreElement = scoreElement;
    this.messageElement = messageElement;
    this.levelElement = levelElement;

    this.player = new Player();
    this.background = new StarBackground();

    this.bullets = [];
    this.enemies = [];
    this.meteors = [];
    this.explosions = [];
    this.bonuses = [];
    this.enemyBullets = [];

    this.score = 0;
    this.level = 1;
    this.frameCount = 0;

    this.shootCooldown = 0;
    this.enemySpawnTimer = 0;
    this.meteorSpawnTimer = 0;

    this.weaponLevel = 1;
    this.bonusMessage = "";
    this.bonusMessageTimer = 0;

    this.gameOver = false;
    this.playerVisible = true;

    this.isRunning = false;
    this.animationId = null;
  }

  start() {
    this.score = 0;
    this.level = 1;
    this.frameCount = 0;

    this.scoreElement.textContent = this.score;
    this.messageElement.textContent = "";
    this.levelElement.textContent = this.level;

    this.player.reset();

    this.bullets = [];
    this.enemies = [];
    this.meteors = [];
    this.explosions = [];
    this.bonuses = [];
    this.enemyBullets = [];

    this.shootCooldown = 0;
    this.enemySpawnTimer = 0;
    this.meteorSpawnTimer = 0;

    this.weaponLevel = 1;
    this.bonusMessage = "";
    this.bonusMessageTimer = 0;

    this.isRunning = true;
    this.gameOver = false;
    this.playerVisible = true;

    cancelAnimationFrame(this.animationId);
    this.loop();
  }

  update() {
    this.background.update();
    this.player.update();
    this.updateDifficulty();

    this.updateShooting();
    this.updateBullets();
    this.updateEnemies();
    this.updateEnemyBullets();
    this.checkEnemyBulletPlayerCollisions();
    this.updateMeteors();

    this.checkBulletEnemyCollisions();
    this.checkBulletMeteorCollisions();
    this.checkPlayerEnemyCollisions();
    this.checkPlayerMeteorCollisions();

    this.updateBonuses();
    this.checkPlayerBonusCollisions();
    this.updateBonusMessage();

    this.updateExplosions();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw(this.ctx);

    for (const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }

    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }

    for (const meteor of this.meteors) {
      meteor.draw(this.ctx);
    }

    for (const bonus of this.bonuses) {
      bonus.draw(this.ctx);
    }

    for (const enemyBullet of this.enemyBullets) {
    enemyBullet.draw(this.ctx);
    }

    if (this.playerVisible) {
      this.player.draw(this.ctx);
    }

    this.drawExplosions();
    this.drawBonusMessage();
  }

  loop() {
    if (!this.isRunning && this.explosions.length === 0) {
      return;
    }

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  updateDifficulty() {
    this.frameCount++;

    if (this.frameCount % 10 === 0) {
      this.score += 1;
      this.scoreElement.textContent = this.score;
    }

    this.level = Math.floor(this.frameCount / 600) + 1;
    this.levelElement.textContent = this.level;
  }

  updateShooting() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    if (!keys.shoot || this.shootCooldown !== 0) {
      return;
    }

    if (this.weaponLevel === 1) {
      this.bullets.push(new Bullet(this.player.x, this.player.y));
    }

    if (this.weaponLevel === 2) {
      this.bullets.push(new Bullet(this.player.x - 12, this.player.y + 10));
      this.bullets.push(new Bullet(this.player.x + 12, this.player.y + 10));
    }

    if (this.weaponLevel === 3) {
      this.bullets.push(new Bullet(this.player.x, this.player.y));
      this.bullets.push(new Bullet(this.player.x - 18, this.player.y + 12));
      this.bullets.push(new Bullet(this.player.x + 18, this.player.y + 12));
    }

    this.shootCooldown = 12;
  }

  updateBullets() {
    for (const bullet of this.bullets) {
      bullet.update();
    }

    this.bullets = this.bullets.filter((bullet) => bullet.active);
  }

  updateEnemies() {
    this.enemySpawnTimer++;

    const spawnRate = Math.max(35, 80 - this.level * 3);

    if (this.enemySpawnTimer >= spawnRate) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;
    }

    for (const enemy of this.enemies) {
      enemy.update();
    }

    this.enemies = this.enemies.filter((enemy) => enemy.active);
  }

  updateMeteors() {
    this.meteorSpawnTimer++;

    const spawnRate = Math.max(90, 180 - this.level * 8);

    if (this.meteorSpawnTimer >= spawnRate) {
      this.meteors.push(new Meteor(this.level));
      this.meteorSpawnTimer = 0;
    }

    for (const meteor of this.meteors) {
      meteor.update();
    }

    this.meteors = this.meteors.filter((meteor) => meteor.active);
  }

  updateBonuses() {
    for (const bonus of this.bonuses) {
      bonus.update();
    }

    this.bonuses = this.bonuses.filter((bonus) => bonus.active);
  }

  updateExplosions() {
    for (const explosion of this.explosions) {
      explosion.radius += 2;
      explosion.life--;
    }

    this.explosions = this.explosions.filter((explosion) => explosion.life > 0);
  }

  spawnEnemy() {
    const roll = Math.random();

    if (this.level < 2) {
      this.enemies.push(new Enemy(this.level));
      return;
    }

    if (this.level < 4) {
      if (roll < 0.75) {
        this.enemies.push(new Enemy(this.level));
      } else {
        this.enemies.push(new SideEnemy(this.level));
      }

      return;
    }

    if (roll < 0.55) {
      this.enemies.push(new Enemy(this.level));
    } else {
      this.enemies.push(new SideEnemy(this.level));
    }
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

          this.tryDropBonus(enemy);
          break;
        }
      }
    }

    this.bullets = this.bullets.filter((bullet) => bullet.active);
    this.enemies = this.enemies.filter((enemy) => enemy.active);
  }

  checkBulletMeteorCollisions() {
    for (const bullet of this.bullets) {
      for (const meteor of this.meteors) {
        if (isColliding(bullet, meteor)) {
          bullet.active = false;
          meteor.takeDamage();

          if (!meteor.active) {
            this.score += 30;
            this.scoreElement.textContent = this.score;

            this.explosions.push({
              x: meteor.x + meteor.width / 2,
              y: meteor.y + meteor.height / 2,
              radius: 6,
              life: 12
            });
          }

          break;
        }
      }
    }

    this.bullets = this.bullets.filter((bullet) => bullet.active);
    this.meteors = this.meteors.filter((meteor) => meteor.active);
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

  checkPlayerMeteorCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const meteor of this.meteors) {
      if (isColliding(playerHitbox, meteor)) {
        this.endGame();
        break;
      }
    }
  }

  checkPlayerBonusCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const bonus of this.bonuses) {
      if (isColliding(playerHitbox, bonus)) {
        bonus.active = false;

        if (bonus.type === BONUS_TYPES.DOUBLE_SHOT && this.weaponLevel < 2) {
          this.weaponLevel = 2;
          this.showBonusMessage("DOUBLE SHOT ACQUIRED");
        }

        if (bonus.type === BONUS_TYPES.TRIPLE_SHOT && this.weaponLevel < 3) {
          this.weaponLevel = 3;
          this.showBonusMessage("TRIPLE SHOT ACQUIRED");
        }
      }
    }

    this.bonuses = this.bonuses.filter((bonus) => bonus.active);
  }
  updateEnemyBullets() {
    for (const enemy of this.enemies) {
      if (enemy.constructor.name === "SideEnemy" && enemy.state === "attacking") {
        enemy.shootTimer--;

        if (enemy.shootTimer <= 0 && enemy.shotsFired < 3) {
          this.enemyBullets.push(
            new EnemyBullet(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              enemy.direction
            )
          );

          enemy.shotsFired++;
          enemy.shootTimer = 25;
        }
      }
    }

    for (const bullet of this.enemyBullets) {
      bullet.update();
    }

    this.enemyBullets = this.enemyBullets.filter((bullet) => bullet.active);
  }
  checkEnemyBulletPlayerCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const bullet of this.enemyBullets) {
      if (isColliding(playerHitbox, bullet)) {
        this.endGame();
        break;
      }
    }
  }

  tryDropBonus(enemy) {
    const roll = Math.random();

    if (this.weaponLevel === 1 && roll < 0.08) {
      this.bonuses.push(
        new Bonus(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          BONUS_TYPES.DOUBLE_SHOT
        )
      );
    }

    if (this.weaponLevel === 2 && roll < 0.02) {
      this.bonuses.push(
        new Bonus(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          BONUS_TYPES.TRIPLE_SHOT
        )
      );
    }
  }

  showBonusMessage(text) {
    this.bonusMessage = text;
    this.bonusMessageTimer = 120;
  }

  updateBonusMessage() {
    if (this.bonusMessageTimer > 0) {
      this.bonusMessageTimer--;
    }
  }

  drawExplosions() {
    for (const explosion of this.explosions) {
      this.ctx.save();

      this.ctx.globalAlpha = explosion.life / 15;
      this.ctx.fillStyle = "#ffcc00";

      this.ctx.beginPath();
      this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
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

  drawBonusMessage() {
    if (this.bonusMessageTimer <= 0) {
      return;
    }

    this.ctx.save();
    this.ctx.fillStyle = "#00ff66";
    this.ctx.font = "20px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.bonusMessage, this.canvas.width / 2, 40);
    this.ctx.restore();
  }

  endGame() {
    if (this.gameOver) {
      return;
    }

    this.gameOver = true;
    this.isRunning = false;
    this.playerVisible = false;

    this.explosions.push({
      x: this.player.x,
      y: this.player.y + this.player.height / 2,
      radius: 8,
      life: 25
    });

    this.messageElement.textContent = `Game Over — Score: ${this.score}`;
  }
}