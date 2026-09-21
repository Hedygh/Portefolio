import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from "./config.js";

export class BossDeathSequence {
  constructor(boss, bossType = "default") {
    this.boss = boss;
    this.bossType = bossType;

    this.timer = 0;
    this.finished = false;
    this.startCenter = this.getBossCenter();

    this.displayCenter = {
    x: this.startCenter.x,
    y: this.startCenter.y
    };

    this.targetCenter = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 + 60
    };

    this.bossScale = 1;
    this.bossRotation = 0;
    this.bossOpacity = 1;

    this.fallStartFrame = 75;

    this.explosions = [];
    this.particles = [];

    this.explosionInterval = 14;
    this.explosionDuration = 180;

    this.finalExplosionFrame = 190;
    this.particleEndFrame = 300;

    this.finalExplosionCreated = false;
    this.particlesCreated = false;
  }

  update() {
    if (this.finished) {
      return;
    }

    this.timer++;

    if (this.timer >= this.fallStartFrame) {
      this.updateBossFall();
    }
    // Petites explosions successives.
    if (
      this.timer <= this.explosionDuration &&
      this.timer % this.explosionInterval === 0
    ) {
      this.createRandomExplosion();
    }

    // Grande explosion finale.
    if (
      this.timer >= this.finalExplosionFrame &&
      !this.finalExplosionCreated
    ) {
      this.createFinalExplosion();
      this.finalExplosionCreated = true;
    }

    // Création des morceaux du boss.
    if (
      this.timer >= this.finalExplosionFrame &&
      !this.particlesCreated
    ) {
      this.createParticles();
      this.particlesCreated = true;
    }

    this.updateExplosions();
    this.updateParticles();

    if (this.timer >= this.particleEndFrame) {
      this.finished = true;
    }
  }
	updateBossFall() {
		/*
		* Le centre visuel du boss se rapproche progressivement
		* du centre inférieur du canvas.
		*/
		this.displayCenter.x +=
			(this.targetCenter.x - this.displayCenter.x) * 0.018;

		this.displayCenter.y +=
			(this.targetCenter.y - this.displayCenter.y) * 0.018;

		/*
		* Le boss rétrécit progressivement.
		*/
		this.bossScale *= 0.992;

		if (this.bossScale < 0.03) {
			this.bossScale = 0.03;
		}

		/*
		* Rotation lente pendant la chute.
		*/
		const rotationDirection =
			this.bossType === "worm" ? 1 : -1;

		this.bossRotation +=
			0.006 * rotationDirection;

		/*
		* L'opacité commence à diminuer après
		* la grande explosion.
		*/
		if (this.timer >= this.finalExplosionFrame) {
			this.bossOpacity -= 0.007;

			if (this.bossOpacity < 0) {
				this.bossOpacity = 0;
			}
		}
	}

  createRandomExplosion() {
    const position = this.getRandomBossPosition();

    this.explosions.push({
      x: position.x,
      y: position.y,
      radius: 4,
      maxRadius: 18 + Math.random() * 16,
      life: 30,
      maxLife: 30
    });
  }

  createFinalExplosion() {
    const center = {
			x: this.displayCenter.x,
			y: this.displayCenter.y
		};

    this.explosions.push({
      x: center.x,
      y: center.y,
      radius: 10,
      maxRadius: 80,
      life: 55,
      maxLife: 55
    });
  }

  createParticles() {
    const particleCount = this.bossType === "worm" ? 45 : 30;

    for (let i = 0; i < particleCount; i++) {
      const position = this.getRandomBossPosition();

      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;

      this.particles.push({
        x: position.x,
        y: position.y,

        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,

        size: 3 + Math.random() * 8,

        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,

        life: 60 + Math.random() * 50,
        maxLife: 110
      });
    }
  }

	transformBossPoint(point) {
		const relativeX =
			point.x - this.startCenter.x;

		const relativeY =
			point.y - this.startCenter.y;

		const cos = Math.cos(this.bossRotation);
		const sin = Math.sin(this.bossRotation);

		const rotatedX =
			relativeX * cos -
			relativeY * sin;

		const rotatedY =
			relativeX * sin +
			relativeY * cos;

		return {
			x:
				this.displayCenter.x +
				rotatedX * this.bossScale,

			y:
				this.displayCenter.y +
				rotatedY * this.bossScale
		};
	}
  getRandomBossPosition() {
		let originalPosition;

		if (
			this.bossType === "worm" &&
			this.boss.segments &&
			this.boss.segments.length > 0
		) {
			const index = Math.floor(
				Math.random() * this.boss.segments.length
			);

			const segment = this.boss.segments[index];

			originalPosition = {
				x: segment.x,
				y: segment.y
			};
		} else {
			originalPosition = {
				x:
					this.boss.x +
					Math.random() * this.boss.width,

				y:
					this.boss.y +
					Math.random() * this.boss.height
			};
		}

		return this.transformBossPoint(
			originalPosition
		);
	}

  getBossCenter() {
    if (
      this.bossType === "worm" &&
      this.boss.segments &&
      this.boss.segments.length > 0
    ) {
      const middleIndex = Math.floor(
        this.boss.segments.length / 2
      );

      return {
        x: this.boss.segments[middleIndex].x,
        y: this.boss.segments[middleIndex].y
      };
    }

    return {
      x: this.boss.x + this.boss.width / 2,
      y: this.boss.y + this.boss.height / 2
    };
  }

  updateExplosions() {
    for (const explosion of this.explosions) {
      explosion.life--;

      const progress =
        1 - explosion.life / explosion.maxLife;

      explosion.radius =
        explosion.maxRadius * progress;
    }

    this.explosions = this.explosions.filter(
      explosion => explosion.life > 0
    );
  }

  updateParticles() {
    for (const particle of this.particles) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      particle.velocityY += 0.025;

      particle.rotation += particle.rotationSpeed;
      particle.life--;
    }

    this.particles = this.particles.filter(
      particle => particle.life > 0
    );
  }

	draw(ctx) {
		this.drawBoss(ctx);
		this.drawExplosions(ctx);
		this.drawParticles(ctx);
	}
	drawBoss(ctx) {
		if (!this.boss || this.bossOpacity <= 0) {
			return;
		}

		ctx.save();

		ctx.globalAlpha = this.bossOpacity;

		/*
		* On place l'origine au nouveau centre visuel.
		*/
		ctx.translate(
			this.displayCenter.x,
			this.displayCenter.y
		);

		ctx.rotate(this.bossRotation);

		ctx.scale(
			this.bossScale,
			this.bossScale
		);

		/*
		* Le boss utilise des coordonnées absolues.
		* On compense donc son ancien centre.
		*/
		ctx.translate(
			-this.startCenter.x,
			-this.startCenter.y
		);

		this.boss.draw(ctx);

		ctx.restore();
	}
  drawExplosions(ctx) {
    for (const explosion of this.explosions) {
      const alpha =
        explosion.life / explosion.maxLife;

      ctx.save();

      ctx.globalAlpha = alpha;

      const gradient = ctx.createRadialGradient(
        explosion.x,
        explosion.y,
        0,
        explosion.x,
        explosion.y,
        explosion.radius
      );

      gradient.addColorStop(0, "white");
      gradient.addColorStop(0.25, "yellow");
      gradient.addColorStop(0.55, "orange");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc(
        explosion.x,
        explosion.y,
        explosion.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    }
  }

  drawParticles(ctx) {
    for (const particle of this.particles) {
      const alpha = Math.min(
        1,
        particle.life / 30
      );

      ctx.save();

      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      ctx.fillStyle =
        this.bossType === "worm"
          ? "#777777"
          : "#3f7cff";

      ctx.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size * 0.65
      );

      ctx.restore();
    }
  }
}
