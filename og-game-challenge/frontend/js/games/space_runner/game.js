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
import { EyeBoss, WormBoss, DragonBoss } from "./bosses.js";
import { BossProjectile } from "./bossProjectiles.js";
import { SteelEyeEnemy } from "./steelEyeEnemy.js";
import { FinalBossBackground } from "./finalBossBackground.js";
import { DragonFireball } from "./dragonFireballs.js";
import { DragonBeam } from "./dragonBeams.js";
import { DragonLaser } from "./dragonLasers.js";
import { VictoryPortal } from "./victoryPortal.js";

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
    this.finalBossBackground = new FinalBossBackground();
    this.lastDragonPhase = 1;

    this.bossTransition = false;
    this.pendingBossLevel = null;

    this.bullets = [];
    this.enemies = [];
    this.meteors = [];
    this.explosions = [];
    this.bonuses = [];
    this.enemyBullets = [];
    this.steelEyeEnemies = [];
    this.dragonFireballs = [];
    this.dragonLasers = [];
    this.dragonLaserTimer = 100;

    this.score = 0;
    this.level = 1;
    this.frameCount = 0;

    this.shootCooldown = 0;
    this.enemySpawnTimer = 0;
    this.meteorSpawnTimer = 0;

    this.weaponLevel = DEV_MODE ? 3 : 1;
    this.bonusMessage = "";
    this.bonusMessageTimer = 0;

    this.boss = null;
    this.bossActive = false;
    this.currentBossLevel = null;
    this.defeatedBossLevels = new Set();
    this.hasShield = false;
    this.damageCooldown = 0;
    this.bossProjectiles = [];

    this.dragonBeams = [];
    this.dragonBeamAngle = 0;

    this.gameOver = false;
    this.playerVisible = true;

    this.isRunning = false;
    this.animationId = null;

 //fin de jeu
    this.victorySequence = false;
    this.victoryPortal = null;
    this.playerVictoryScale = 1;
    this.victoryFinished = false;

    this.victoryTitleVisible = false;
    this.victoryTitleProgress = 0;
    this.victoryTitleTimer = 0;
  }
  
/*═══════════════════════════════════════════════════════
                      CONSTRUCTOR
═══════════════════════════════════════════════════════*/
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
    this.finalBossBackground.reset();

    this.bossTransition = false;
    this.pendingBossLevel = null;

    this.bullets = [];
    this.enemies = [];
    this.meteors = [];
    this.explosions = [];
    this.bonuses = [];
    this.enemyBullets = [];
    this.steelEyeEnemies = [];
    this.dragonFireballs = [];
    this.dragonLasers = [];
    this.dragonLaserTimer = 100; 

    this.shootCooldown = 0;
    this.enemySpawnTimer = 0;
    this.meteorSpawnTimer = 0;

    this.weaponLevel = DEV_MODE ? 3 : 1;
    this.bonusMessage = "";
    this.bonusMessageTimer = 0;

    this.boss = null;
    this.bossActive = false;
    this.currentBossLevel = null;
    this.defeatedBossLevels = new Set();
    this.hasShield = false;
    this.damageCooldown = 0;
    this.bossProjectiles = [];

    this.dragonBeams = [];
    this.dragonBeamAngle = 0;

    this.isRunning = true;
    this.gameOver = false;
    this.playerVisible = true;

    this.victorySequence = false;
    this.victoryPortal = null;
    this.playerVictoryScale = 1;
    this.victoryFinished = false;

    cancelAnimationFrame(this.animationId);
    this.loop();
  }

  update() {
    if (this.damageCooldown > 0) {
      this.damageCooldown--;
    }
    this.background.update();
    if (this.level === 15 || this.currentBossLevel === 15) {
      this.finalBossBackground.update();
    }
    if (this.victorySequence) {
      this.updateVictorySequence();
    } else {
      this.player.update();
      this.updateDifficulty();
    }
    if (this.victorySequence) {
      this.updateExplosions();
      return;
    }
    this.updateShooting();
    this.updateBullets();

    if (this.bossActive) {
      this.updateBoss();

      if (this.currentBossLevel === 5) {
        this.checkBulletBossCollisions();
      }

      if (this.currentBossLevel === 10) {
        this.checkBulletWormBossCollisions();
        this.checkPlayerWormBossCollisions();
      }
    if (this.currentBossLevel === 15) {
      if (
        this.lastDragonPhase === 1 &&
        this.boss.phase === 2
      ) {
        this.dragonFireballs = [];
      }

      if (
        this.lastDragonPhase === 2 &&
        this.boss.phase === 3
      ) {
        this.dragonBeams = [];
        this.dragonFireballs = [];
        this.dragonLasers = [];
        this.dragonLaserTimer = 80;
      }

      this.lastDragonPhase = this.boss.phase;

      this.updateDragonPhaseOne();
      this.updateDragonPhaseTwo();
      this.updateDragonPhaseThree();

      this.checkBulletDragonBossCollisions();
    }

    } else {
      this.updateEnemies();
      this.updateMeteors();
      this.updateSteelEyeEnemies();
      this.updateBossTransition();
    }

    this.updateEnemyBullets();
    this.checkEnemyBulletPlayerCollisions();

    this.checkBulletEnemyCollisions();
    this.checkBulletMeteorCollisions();
    this.checkPlayerEnemyCollisions();
    this.checkPlayerMeteorCollisions();
    this.checkBulletSteelEyeCollisions();
    this.checkPlayerSteelEyeCollisions();

    this.updateBonuses();
    this.checkPlayerBonusCollisions();
    this.updateBonusMessage();

    this.updateBossProjectiles();
    this.checkBossProjectilePlayerCollisions();

    this.updateExplosions();
    this.updateDragonFireballs();
    this.checkDragonFireballPlayerCollisions();
    this.clearDragonBeamsOutsidePhaseTwo();
    this.checkDragonBeamPlayerCollisions();
    this.updateDragonLasers();
    this.checkDragonLaserPlayerCollisions();
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw(this.ctx);
    if (this.level === 15 || this.currentBossLevel === 15) {
      this.finalBossBackground.draw(this.ctx);
    }

    for (const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }

    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }
    for (const enemy of this.steelEyeEnemies) {
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

    for (const beam of this.dragonBeams) {
      beam.draw(this.ctx);
    }

    for (const fireball of this.dragonFireballs) {
      fireball.draw(this.ctx);
    }
    for (const beam of this.dragonBeams) {
      beam.draw(this.ctx);
    }

    for (const fireball of this.dragonFireballs) {
      fireball.draw(this.ctx);
    }

    for (const laser of this.dragonLasers) {
      laser.draw(this.ctx);
    }
    if (this.victoryPortal) {
      this.victoryPortal.draw(this.ctx);
    }
    if (this.playerVisible) {
      if (this.victorySequence) {
        this.ctx.save();

        this.ctx.translate(
          this.player.x,
          this.player.y
        );

        this.ctx.scale(
          this.playerVictoryScale,
          this.playerVictoryScale
        );

        this.ctx.translate(
          -this.player.x,
          -this.player.y
        );

        this.player.draw(this.ctx);

        this.ctx.restore();
      } else {
        this.player.draw(this.ctx);

        if (this.hasShield) {
          this.player.drawShield(this.ctx);
        }
      }
    }

    this.drawExplosions();
    this.drawBonusMessage();
    this.drawBossProjectiles();
    this.drawVictoryTitle();
  }

  loop() {
    if (!this.isRunning && this.explosions.length === 0) {
      return;
    }

    this.update();
    this.draw();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

/*═══════════════════════════════════════════════════════
                      GAME FLOW
═══════════════════════════════════════════════════════*/
 startVictorySequence() {
    this.victorySequence = true;

    this.boss = null;
    this.bossActive = false;
    this.currentBossLevel = null;

    this.bullets = [];
    this.enemies = [];
    this.meteors = [];
    this.enemyBullets = [];
    this.bossProjectiles = [];
    this.dragonFireballs = [];
    this.dragonBeams = [];
    this.dragonLasers = [];
    this.steelEyeEnemies = [];
    this.bonuses = [];

    this.victoryPortal = new VictoryPortal();

    this.showBonusMessage("VICTORY");
  }
  updateVictorySequence() {
    if (!this.victoryPortal) {
      return;
    }

    this.victoryPortal.update();

    if (!this.victoryPortal.opened) {
      return;
    }

    const targetX = this.victoryPortal.x;
    const targetY = this.victoryPortal.y;

    const dx = targetX - this.player.x;
    const dy = targetY - this.player.y;

    const distance = Math.hypot(dx, dy);

    if (distance > 8) {
      const speed = 1.2;

      this.player.x +=
        (dx / distance) * speed;

      this.player.y +=
        (dy / distance) * speed;

      return;
    }

    this.player.x = targetX;
    this.player.y = targetY;

    this.playerVictoryScale -= 0.025;

    if (this.playerVictoryScale <= 0) {
      this.playerVictoryScale = 0;
      this.playerVisible = false;

      this.victoryTitleVisible = true;

      if (this.victoryTitleProgress < 1) {
        this.victoryTitleProgress += 0.018;
      } else {
        this.victoryTitleProgress = 1;
        this.victoryTitleTimer++;
      }

      if (
        this.victoryTitleTimer >= 150 &&
        !this.victoryFinished
      ) {
        this.victoryFinished = true;
        this.winGame();
      }
    }
  }

  winGame() {
    this.isRunning = false;
    this.gameOver = true;

    this.messageElement.textContent =
      `Victory — Final Score: ${this.score}`;
    window.handleGameOver("space-runner", this.score);
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
    window.handleGameOver("space-runner", this.score);
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
/*═══════════════════════════════════════════════════════
                      LEVEL / GAME PROGRESSION
═══════════════════════════════════════════════════════*/
  updateDifficulty() {
    if (this.bossActive) {
      this.level = this.currentBossLevel;
      this.levelElement.textContent = this.level;
      return;
    }

    if (this.bossTransition) {
      this.level = this.pendingBossLevel;
      this.levelElement.textContent = this.level;
      return;
    }

    this.frameCount++;

    if (this.frameCount % 10 === 0) {
      this.score += 1;
      this.scoreElement.textContent = this.score;
    }

    this.level = Math.floor(this.frameCount / 1200) + 1;
    // Safe keep for dev mode last boss
    if (this.level >= 15) {
      this.level = 15;
    }
    this.levelElement.textContent = this.level;

    if (this.shouldStartBossFight(this.level)) {
      this.startBossTransition(this.level);
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
    return level === 5 || level == 10 || level == 15;
  }

  startBossTransition(level) {
    if (this.bossTransition || this.bossActive) {
      return;
    }

    this.bossTransition = true;
    this.pendingBossLevel = level;

    this.showBonusMessage("BOSS APPROACHING");
  }
  updateBossTransition() {
    if (!this.bossTransition) {
      return;
    }

    const enemiesRemaining =
      this.enemies.length > 0;

    const meteorsRemaining =
      this.meteors.length > 0;

    const steelEyesRemaining =
      this.steelEyeEnemies.length > 0;

    const enemyBulletsRemaining =
      this.enemyBullets.length > 0;

    if (
      enemiesRemaining ||
      meteorsRemaining ||
      steelEyesRemaining ||
      enemyBulletsRemaining
    ) {
      return;
    }

    const bossLevel = this.pendingBossLevel;

    this.bossTransition = false;
    this.pendingBossLevel = null;

    this.startBossFight(bossLevel);
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

    if (this.level < 11) {
      if (roll < 0.55) {
        this.enemies.push(new Enemy(this.level));
      } else {
        this.enemies.push(new SideEnemy(this.level));
      }

      return;
    }

    if (this.level <= 14) {
      if (roll < 0.35) {
        this.enemies.push(new Enemy(this.level));
      } else if (roll < 0.50) {
        this.enemies.push(new SideEnemy(this.level));
      } else {
        this.steelEyeEnemies.push(
          new SteelEyeEnemy(this.level)
        );
      }
    }
  }

/*═══════════════════════════════════════════════════════
                      PLAYER
═══════════════════════════════════════════════════════*/
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

/*═══════════════════════════════════════════════════════
                      CLASSIC ENNEMIES
═══════════════════════════════════════════════════════*/

  updateEnemies() {
    if (!this.bossTransition) {
      this.enemySpawnTimer++;

      const spawnRate = Math.max(
        45,
        105 - this.level * 5
      );

      if (this.enemySpawnTimer >= spawnRate) {
        this.spawnEnemy();
        this.enemySpawnTimer = 0;
      }
    }

    for (const enemy of this.enemies) {
      enemy.update();
    }

    this.enemies = this.enemies.filter(
      (enemy) => enemy.active
    );
  }
  updateMeteors() {
    if (this.level >= 11) {
      this.meteors = [];
      return;
    }

    if (!this.bossTransition) {
      this.meteorSpawnTimer++;

      const spawnRate = Math.max(
        90,
        180 - this.level * 8
      );

      if (this.meteorSpawnTimer >= spawnRate) {
        this.meteors.push(
          new Meteor(this.level)
        );

        this.meteorSpawnTimer = 0;
      }
    }

    for (const meteor of this.meteors) {
      meteor.update();
    }

    this.meteors = this.meteors.filter(
      (meteor) => meteor.active
    );
  }
  updateSteelEyeEnemies() {
    for (const enemy of this.steelEyeEnemies) {
      enemy.update(this.player);
    }

    this.steelEyeEnemies =
      this.steelEyeEnemies.filter(
        (enemy) => enemy.active
      );
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
/*═══════════════════════════════════════════════════════
                      BONUSES
═══════════════════════════════════════════════════════*/
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
  updateBonuses() {
    for (const bonus of this.bonuses) {
      bonus.update();
    }

    this.bonuses = this.bonuses.filter((bonus) => bonus.active);
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




/*═══════════════════════════════════════════════════════
                      BOSS MANAGEMENT
═══════════════════════════════════════════════════════*/

  createBoss(level) {
    if (level === 5) {
      return new EyeBoss();
    }
    if (level === 10) {
      return new WormBoss();
    }
    if (level == 15) {
      return new DragonBoss();
    }
    return null;
  }
  startBossFight(level) {
    const boss = this.createBoss(level);

    if (!boss) {
      return;
    }

    this.boss = boss;
    this.bossActive = true;
    this.currentBossLevel = level;

    this.bossProjectiles = [];
    this.dragonBeams = [];
    this.dragonBeamAngle = 0;
    this.dragonLasers = [];
    this.dragonLaserTimer = 100;

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
      this.currentBossLevel == 5 &&
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
    if (defeatedLevel === 10) {
      if (!this.hasShield) {
        this.hasShield = true;
        this.showBonusMessage("SHIELD ACQUIRED");
      } else {
        this.showBonusMessage("SHIELD PRESERVED");
      }
    }
    if (defeatedLevel === 15) {
      this.startVictorySequence();
      return;
    }

    this.level = defeatedLevel + 1;
    this.frameCount = defeatedLevel * 1200;
    this.levelElement.textContent = this.level;
  } 



/*═══════════════════════════════════════════════════════
                      BOSS 1: EYE BOSS
═══════════════════════════════════════════════════════*/
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

/*═══════════════════════════════════════════════════════
                      BOSS 2: WORM
═══════════════════════════════════════════════════════*/
  getWormSegmentHitbox(segment) {
    return {
      x: segment.x - segment.radius,
      y: segment.y - segment.radius,
      width: segment.radius * 2,
      height: segment.radius * 2
    };
  }

  checkBulletWormBossCollisions() {
    if (
      !this.bossActive ||
      !this.boss ||
      this.currentBossLevel !== 10
    ) {
      return;
    }

    for (const bullet of this.bullets) {
      for (const segment of this.boss.segments) {
        const segmentHitbox =
          this.getWormSegmentHitbox(segment);

        if (isColliding(bullet, segmentHitbox)) {
          bullet.active = false;
          this.boss.takeDamage();

          this.explosions.push({
            x: bullet.x,
            y: bullet.y,
            radius: 3,
            life: 8
          });

          break;
        }
      }
    }

    this.bullets = this.bullets.filter(
      (bullet) => bullet.active
    );
  }
  checkPlayerWormBossCollisions() {
    if (
      !this.bossActive ||
      !this.boss ||
      this.currentBossLevel !== 10
    ) {
      return;
    }

    const playerHitbox = this.player.getHitbox();

    for (const segment of this.boss.segments) {
      const segmentHitbox =
        this.getWormSegmentHitbox(segment);

      if (isColliding(playerHitbox, segmentHitbox)) {
        this.damagePlayer();
        break;
      }
    }
  }

/*═══════════════════════════════════════════════════════
                      BOSS 3: DRAGON
═══════════════════════════════════════════════════════*/
  getDragonHitbox() {
    return {
      x:
        this.boss.x +
        this.boss.width / 2 -
        48,

      y:
        this.boss.y + 45,

      width: 96,
      height: 115
    };
  }

  updateDragonPhaseOne() {
    if (
      !this.bossActive ||
      !this.boss ||
      this.currentBossLevel !== 15 ||
      this.boss.state !== "fighting" ||
      this.boss.phase !== 1
    ) {
      return;
    }
    if (this.boss.phase !== 1) {
      return;
    }

    if (this.boss.attackTimer > 0) {
      return;
    }

    const mouth =
      this.boss.getMouthPosition();

    this.dragonFireballs.push(
      new DragonFireball(
        mouth.x,
        mouth.y,
        this.player.x,
        this.player.y
      )
    );

    this.boss.attackTimer = 110;
  }

  updateDragonPhaseTwo() {
    if (
      !this.bossActive ||
      !this.boss ||
      this.currentBossLevel !== 15 ||
      this.boss.state !== "fighting" ||
      this.boss.phase !== 2
    ) {
      return;
    }

    const mouth =
      this.boss.getMouthPosition();

    /*
    * Le dragon doit être arrivé presque au centre
    * avant que le premier rayon soit créé.
    */
    const distanceFromCenter =
      Math.hypot(
        this.boss.centerTargetX - this.boss.x,
        this.boss.centerTargetY - this.boss.y
      );

    if (distanceFromCenter > 4) {
      return;
    }

    if (this.dragonBeams.length === 0) {
      this.dragonBeams.push(
        new DragonBeam(0)
      );
    }

    const healthRatio =
      this.boss.health / this.boss.maxHealth;

    /*
    * À 40 % des PV, ajout d'un rayon perpendiculaire.
    * PI / 2 correspond à 90 degrés.
    */
    if (
      healthRatio <= 0.4 &&
      this.dragonBeams.length === 1
    ) {
      this.dragonBeams.push(
        new DragonBeam(Math.PI / 2)
      );
    }

    this.dragonBeamAngle += 0.008;

    for (const beam of this.dragonBeams) {
      beam.update(
        mouth.x,
        mouth.y,
        this.dragonBeamAngle
      );
    }
  }

  updateDragonPhaseThree() {
    if (
      !this.bossActive ||
      !this.boss ||
      this.currentBossLevel !== 15 ||
      this.boss.state !== "fighting" ||
      this.boss.phase !== 3
    ) {
      return;
    }

    const distanceFromTarget =
      Math.hypot(
        this.boss.centerTargetX - this.boss.x,
        this.boss.centerTargetY - this.boss.y
      );

    if (distanceFromTarget > 4) {
      return;
    }

    this.updateDragonPhaseThreeFireballs();
    this.updateDragonPhaseThreeLasers();
  }
  updateDragonPhaseThreeFireballs() {
    if (this.boss.attackTimer > 0) {
      return;
    }

    const mouth =
      this.boss.getMouthPosition();

    this.dragonFireballs.push(
      new DragonFireball(
        mouth.x,
        mouth.y,
        this.player.x,
        this.player.y
      )
    );

    this.boss.attackTimer = 110;
  }
  updateDragonPhaseThreeLasers() {
    this.dragonLaserTimer--;

    if (this.dragonLaserTimer > 0) {
      return;
    }

    const mouth =
      this.boss.getMouthPosition();

    const angle =
      Math.random() * Math.PI;

    this.dragonLasers.push(
      new DragonLaser(
        mouth.x,
        mouth.y,
        angle
      )
    );

    this.dragonLaserTimer =
      100 + Math.floor(Math.random() * 55);
  }
  checkBulletDragonBossCollisions() {
    if (
      !this.bossActive ||
      !this.boss ||
      this.currentBossLevel !== 15
    ) {
      return;
    }

    const dragonHitbox =
      this.getDragonHitbox();

    for (const bullet of this.bullets) {
      if (
        isColliding(
          bullet,
          dragonHitbox
        )
      ) {
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

    this.bullets = this.bullets.filter(
      (bullet) => bullet.active
    );
  }

  checkDragonFireballPlayerCollisions() {
    const playerHitbox =
      this.player.getHitbox();

    for (const fireball of this.dragonFireballs) {
      const fireballHitbox =
        fireball.getHitbox();

      if (
        isColliding(
          playerHitbox,
          fireballHitbox
        )
      ) {
        this.damagePlayer();

        if (fireball.state === "flying") {
          fireball.state = "burning";
          fireball.vx = 0;
          fireball.vy = 0;
          fireball.radius = 30;
          fireball.updateHitbox();
        }

        break;
      }
    }
  }

  checkDragonBeamPlayerCollisions() {
    if (this.dragonBeams.length === 0) {
      return;
    }

    const playerHitbox =
      this.player.getHitbox();

    for (const beam of this.dragonBeams) {
      if (beam.isCollidingWith(playerHitbox)) {
        this.damagePlayer();
        break;
      }
    }
  }

  checkDragonLaserPlayerCollisions() {
    if (this.dragonLasers.length === 0) {
      return;
    }

    const playerHitbox =
      this.player.getHitbox();

    for (const laser of this.dragonLasers) {
      if (laser.isCollidingWith(playerHitbox)) {
        this.damagePlayer();
        break;
      }
    }
  }

  clearDragonBeamsOutsidePhaseTwo() {
    if (
      !this.boss ||
      this.currentBossLevel !== 15
    ) {
      this.dragonBeams = [];
      return;
    }

    if (this.boss.phase !== 2) {
      this.dragonBeams = [];
    }
  }
  updateDragonFireballs() {
    for (const fireball of this.dragonFireballs) {
      fireball.update();
    }

    this.dragonFireballs =
      this.dragonFireballs.filter(
        (fireball) => fireball.active
      );
  }
  updateDragonLasers() {
    for (const laser of this.dragonLasers) {
      laser.update();
    }

    this.dragonLasers =
      this.dragonLasers.filter(
        (laser) => laser.active
      );
  }

/*═══════════════════════════════════════════════════════
                      COLLISIONS
═══════════════════════════════════════════════════════*/


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

  checkPlayerSteelEyeCollisions() {
    const playerHitbox = this.player.getHitbox();

    for (const enemy of this.steelEyeEnemies) {
      if (isColliding(playerHitbox, enemy)) {
        enemy.active = false;

        this.explosions.push({
          x: enemy.x + enemy.width / 2,
          y: enemy.y + enemy.height / 2,
          radius: 8,
          life: 18
        });

        this.damagePlayer();
        break;
      }
    }

    this.steelEyeEnemies =
      this.steelEyeEnemies.filter(
        (enemy) => enemy.active
      );
  }

  checkBulletSteelEyeCollisions() {
    for (const bullet of this.bullets) {
      for (const enemy of this.steelEyeEnemies) {
        if (isColliding(bullet, enemy)) {
          bullet.active = false;
          enemy.takeDamage();

          this.explosions.push({
            x: bullet.x,
            y: bullet.y,
            radius: 3,
            life: 8
          });

          if (!enemy.active) {
            this.score += 250;
            this.scoreElement.textContent = this.score;

            this.explosions.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y + enemy.height / 2,
              radius: 8,
              life: 18
            });

            this.tryDropBonus(enemy);
          }

          break;
        }
      }
    }

    this.bullets = this.bullets.filter(
      (bullet) => bullet.active
    );

    this.steelEyeEnemies =
      this.steelEyeEnemies.filter(
        (enemy) => enemy.active
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
/*═══════════════════════════════════════════════════════
                      VISUAL EFFECTS
═══════════════════════════════════════════════════════*/
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
  drawVictoryTitle() {
    if (!this.victoryTitleVisible) {
      return;
    }

    const progress = this.victoryTitleProgress;

    const scale =
      0.35 + progress * 0.65;

    const alpha =
      Math.min(1, progress * 1.6);

    const centerX =
      this.canvas.width / 2;

    const centerY =
      this.canvas.height / 2;

    this.ctx.save();

    this.ctx.globalAlpha = alpha;

    this.ctx.translate(
      centerX,
      centerY
    );

    this.ctx.scale(scale, scale);

    /*
    * Inclinaison horizontale donnant
    * un effet de titre spatial dynamique.
    */
    this.ctx.transform(
      1,
      0,
      -0.18,
      1,
      0,
      0
    );

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    const gradient =
      this.ctx.createLinearGradient(
        0,
        -80,
        0,
        80
      );

    gradient.addColorStop(0, "#fff6a8");
    gradient.addColorStop(0.35, "#ffb62e");
    gradient.addColorStop(0.7, "#ff5a24");
    gradient.addColorStop(1, "#c01cff");

    this.ctx.fillStyle = gradient;

    this.ctx.strokeStyle = "#7c22ff";
    this.ctx.lineWidth = 6;

    this.ctx.shadowColor = "#ff4bd8";
    this.ctx.shadowBlur = 16;

    this.ctx.font =
      "900 76px Orbitron, sans-serif";

    this.ctx.strokeText(
      "SPACE",
      0,
      -43
    );

    this.ctx.fillText(
      "SPACE",
      0,
      -43
    );

    this.ctx.font =
      "900 68px Orbitron, sans-serif";

    this.ctx.strokeText(
      "RUNNER",
      0,
      38
    );

    this.ctx.fillText(
      "RUNNER",
      0,
      38
    );

    this.ctx.restore();
  }
}