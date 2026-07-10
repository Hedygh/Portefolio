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
import { EyeBoss } from "./bosses.js";
import { BossProjectile } from "./bossProjectiles.js";

import {
  DEV_MODE,
  DEV_START_LEVEL
} from "./config.js";

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

    this.boss = null;
    this.bossActive = false;
    this.currentBossLevel = null;
    this.defeatedBossLevels = new Set();
    this.hasShield = false;
    this.damageCooldown = 0;
    this.bossProjectiles = [];

    this.gameOver = false;
    this.playerVisible = true;

    this.isRunning = false;
    this.animationId = null;
  }

  start() {
    this.score = 0;
   // this.level = 1;
   // this.frameCount = 0;
   //DEV MODE
this.level = DEV_MODE ? DEV_START_LEVEL : 1;

this.frameCount = DEV_MODE
  ? (DEV_START_LEVEL - 1) * 1200
  : 0;
   //DEV MODE

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

    this.boss = null;
    this.bossActive = false;
    this.currentBossLevel = null;
    this.defeatedBossLevels = new Set();
    this.hasShield = false;
    this.damageCooldown = 0;
    this.bossProjectiles = [];

    this.isRunning = true;
    this.gameOver = false;
    this.playerVisible = true;

    cancelAnimationFrame(this.animationId);
    this.loop();
  }

  update() {
    if (this.damageCooldown > 0) {
      this.damageCooldown--;
    }
    this.background.update();
    this.player.update();
    this.updateDifficulty();

    this.updateShooting();
    this.updateBullets();

    if (this.bossActive) {
      this.updateBoss();
      this.checkBulletBossCollisions();
    } else {
      this.updateEnemies();
      this.updateMeteors();
    }

    this.updateEnemyBullets();
    this.checkEnemyBulletPlayerCollisions();

    this.checkBulletEnemyCollisions();
    this.checkBulletMeteorCollisions();
    this.checkPlayerEnemyCollisions();
    this.checkPlayerMeteorCollisions();

    this.updateBonuses();
    this.checkPlayerBonusCollisions();
    this.updateBonusMessage();

    this.updateBossProjectiles();
    this.checkBossProjectilePlayerCollisions();

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

    if (this.boss) {
      this.boss.draw(this.ctx);
    }
    if (this.playerVisible) {
      this.player.draw(this.ctx);
      if (this.hasShield && this.playerVisible) {
        this.player.drawShield(this.ctx);
      }
    }

    this.drawExplosions();
    this.drawBonusMessage();
    this.drawBossProjectiles();
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
    if (this.bossActive) {
      this.level = this.currentBossLevel;
      this.levelElement.textContent = this.level;
      return;
    }

    this.frameCount++;

    if (this.frameCount % 10 === 0) {
      this.score += 1;
      this.scoreElement.textContent = this.score;
    }

    this.level = Math.floor(this.frameCount / 1200) + 1;
    this.levelElement.textContent = this.level;

    if (this.shouldStartBossFight(this.level)) {
      this.startBossFight(this.level);
    }
  }
// Method pour gérer le spawn des boss en fonction du level
  shouldStartBossFight(level) {
    return (
      this.isBossLevel(level) &&
      !this.defeatedBossLevels.has(level) &&
      this.canCreateBoss(level)
    );
  }

  isBossLevel(level) {
    return level === 5 || level === 10 || level === 15;
  }
  canCreateBoss(level) {
    return level === 5;
  }

  createBoss(level) {
    if (level === 5) {
      return new EyeBoss();
    }

    return null;
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

    const spawnRate = Math.max(45, 105 - this.level * 5);

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
        enemy.active = false;

        this.explosions.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          radius: 6,
          life: 15
        });

        this.damagePlayer();
        break;
      }
    }

    this.enemies = this.enemies.filter(
      (enemy) => enemy.active
    );
  }

  checkPlayerMeteorCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const meteor of this.meteors) {
      if (isColliding(playerHitbox, meteor)) {
        meteor.active = false;

        this.explosions.push({
          x: meteor.x + meteor.width / 2,
          y: meteor.y + meteor.height / 2,
          radius: 8,
          life: 18
        });

        this.damagePlayer();
        break;
      }
    }

    this.meteors = this.meteors.filter(
      (meteor) => meteor.active
    );
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
        bullet.active = false;
        this.damagePlayer();
        break;
      }
    }

    this.enemyBullets = this.enemyBullets.filter(
      (bullet) => bullet.active
    );
  }

  tryDropBonus(enemy) {
    const roll = Math.random();

    if (this.level >= 6 && this.weaponLevel === 1 && roll < 0.08) {
      this.bonuses.push(
        new Bonus(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          BONUS_TYPES.DOUBLE_SHOT
        )
      );
    }

    if (this.level >= 11 && this.weaponLevel === 2 && roll < 0.02) {
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

   startBossFight(level) {
    const boss = this.createBoss(level);

    if (!boss) {
      return;
    }

    this.boss = boss;
    this.bossActive = true;
    this.currentBossLevel = level;

    this.enemies = [];
    this.meteors = [];
    this.enemyBullets = [];
    this.bossProjectiles = [];

    this.showBonusMessage(`BOSS ${level / 5} APPROACHING`);
  }

  updateBoss() {
    if (!this.bossActive || !this.boss) {
      return;
    }

    this.boss.update();

    // La mort du boss est contrôlée à chaque frame.
    if (!this.boss.active) {
      this.finishBossFight();
      return;
    }

    // Gestion des attaques du Boss 1.
    if (
      this.boss.state === "fighting" &&
      this.boss.attackTimer <= 0
    ) {
      this.fireBossArc();

      const healthRatio =
        this.boss.health / this.boss.maxHealth;

      if (healthRatio > 0.66) {
        this.boss.attackTimer = 240;
      } else if (healthRatio > 0.33) {
        this.boss.attackTimer = 180;
      } else {
        this.boss.attackTimer = 120;
      }
    }
  }

  fireBossArc() {
    const centerX = this.boss.x + this.boss.width / 2;
    const centerY = this.boss.y + this.boss.height / 2;

    const projectileCount = 13;
    const startAngle = 0;
    const endAngle = Math.PI;

    for (let i = 0; i < projectileCount; i++) {
      const ratio = i / (projectileCount - 1);
      const angle = startAngle + ratio * (endAngle - startAngle);

      this.bossProjectiles.push(
        new BossProjectile(centerX, centerY, angle, 2.1)
      );
    }
  }

  finishBossFight() {
    const defeatedLevel = this.currentBossLevel;

    this.defeatedBossLevels.add(defeatedLevel);

    this.bossActive = false;
    this.currentBossLevel = null;
    this.bossProjectiles = [];
    this.boss = null;

    this.score += 1000;
    this.scoreElement.textContent = this.score;

    if (defeatedLevel === 5) {
      this.hasShield = true;
      this.showBonusMessage("SHIELD ACQUIRED");
    }

    if (defeatedLevel === 15) {
      this.winGame();
      return;
    }

    this.level = defeatedLevel + 1;
    this.frameCount = defeatedLevel * 1200;
    this.levelElement.textContent = this.level;
  }
  checkBulletBossCollisions() {
    if (!this.bossActive || !this.boss) {
      return;
    }

    for (const bullet of this.bullets) {
      if (isColliding(bullet, this.boss)) {
        bullet.active = false;
        this.boss.takeDamage();

        this.explosions.push({
          x: bullet.x,
          y: bullet.y,
          radius: 3,
          life: 8
        });
      }
    }

    this.bullets = this.bullets.filter((bullet) => bullet.active);
  }

  updateBossProjectiles() {
    for (const projectile of this.bossProjectiles) {
      projectile.update();
    }

    this.bossProjectiles = this.bossProjectiles.filter((projectile) => projectile.active);
  }

  drawBossProjectiles() {
    for (const projectile of this.bossProjectiles) {
      projectile.draw(this.ctx);
    }
  }

  checkBossProjectilePlayerCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const projectile of this.bossProjectiles) {
      if (isColliding(playerHitbox, projectile)) {
        projectile.active = false;
        this.damagePlayer();
        break;
      }
    }
    this.bossProjectiles = this.bossProjectiles.filter(
      (projectile) => projectile.active
    );
  }

  damagePlayer() {
    if (this.damageCooldown > 0) {
      return;
    }

    if (this.hasShield) {
      this.hasShield = false;
      this.showBonusMessage("SHIELD LOST");

      this.explosions.push({
        x: this.player.x,
        y: this.player.y + this.player.height / 2,
        radius: 6,
        life: 12
      });

      return;
    }

    this.endGame();
  }

  winGame() {
    this.isRunning = false;
    this.gameOver = true;

    this.messageElement.textContent =
      `Victory — Final Score: ${this.score}`;
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