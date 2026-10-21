import { Player } from "./player.js";

export class Intro {
  constructor(canvas, background) {
    this.canvas = canvas;
    this.background = background;

    this.width = canvas.width;
    this.height = canvas.height;

    // Vaisseau indépendant de celui du gameplay
    this.player = new Player();
    this.player.setWeaponLevel(1);

    // Durée de la cinématique
    this.duration = 9500;
    this.elapsed = 0;

    this.active = false;
    this.finished = false;

    // Planète
    this.planet = {
      x: this.width / 2,
      y: this.height * 0.68,
      radius: Math.min(this.width * 0.23, this.height * 0.18) * 1.2
    };

    // Portail
    this.portal = {
      x: this.width / 2,
      y: this.height * 0.23,
      radius: 42,
      rotation: 0,
      progress: 0
    };

    // Position initiale du vaisseau
    this.shipStart = {
      x: this.planet.x,
      y: this.planet.y - this.planet.radius + 60
    };

    this.ship = {
      x: this.shipStart.x,
      y: this.shipStart.y,
      scale: 0.75,
      rotation: 0
    };

    // Position du portail dans le monde du jeu
    this.arrivalPortal = {
        x: this.width / 2,
        y: this.height * 0.23
    };

    // Position finale du vaisseau
    this.arrivalTarget = {
        x: this.width / 2,
        y: this.height - 70
    };

    // Particules du portail
    this.particles = [];

    for (let i = 0; i < 28; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 30 + Math.random() * 25,
        size: 1 + Math.random() * 2,
        speed: 0.4 + Math.random() * 0.8
      });
    }
  }

  /*═══════════════════════════════════════════════════════
                         INTRO FLOW
  ═══════════════════════════════════════════════════════*/

  start() {
    this.elapsed = 0;

    this.active = true;
    this.finished = false;

    this.portal.rotation = 0;
    this.portal.progress = 0;

		this.portal.x = this.width / 2;
		this.portal.y = this.height * 0.23;

    this.ship.x = this.shipStart.x;
    this.ship.y = this.shipStart.y;
    this.ship.scale = 0.75;
    this.ship.rotation = 0;

    this.player.reset();
    this.player.setWeaponLevel(1);
  }

  update(deltaTime) {
    if (!this.active || this.finished) {
      return;
    }

    this.elapsed += Math.max(0, deltaTime);

    const time = this.elapsed;

    // Animation permanente du portail
    this.portal.rotation += deltaTime * 0.0015;

    // Apparition du portail : 2 à 3,5 secondes
    if (time >= 2000 && time < 3500) {
      const progress = (time - 2000) / 1500;

      this.portal.progress = this.easeOutCubic(progress);
    }

    if (time >= 3500 && time < 7000) {
			this.portal.progress = 1;
		}

    // Décollage : 3,5 à 5,5 secondes
    if (time >= 3500 && time < 5500) {
      this.updateShip(time);
    }

    // Vaisseau entièrement entré dans le portail
    if (time >= 5500) {
      this.ship.scale = 0;
    }

		// Arrivée dans le monde du jeu
		if (time >= 7000) {
			if (time < 7600) {
				this.portal.progress = 0;
			}

			this.updateArrival(time);
		}

    // Fin de la cinématique
    if (time >= this.duration) {
      this.finish();
    }
  }

  updateShip(time) {
    const progress = Math.min(1, (time - 3500) / 2000);

    const eased = this.easeInOutCubic(progress);

    const startX = this.shipStart.x;
    const startY = this.shipStart.y;

    const targetX = this.portal.x;
    const targetY = this.portal.y;

    this.ship.x = startX + (targetX - startX) * eased;
    this.ship.y = startY + (targetY - startY) * eased;

    // Le vaisseau rétrécit en entrant dans le portail
    if (progress > 0.7) {
      const shrink = (progress - 0.7) / 0.3;

      this.ship.scale = 0.75 * (1 - shrink);
    }

    // Légère inclinaison pendant le décollage
    this.ship.rotation = Math.sin(progress * Math.PI) * 0.08;
  }

  updateArrival(time) {
    // Ouverture du portail : 7 à 7,6 secondes
    if (time < 7600) {
        const progress = Math.min(1, (time - 7000) / 600);

        this.portal.progress = this.easeOutCubic(progress);
    }

    // Sortie du vaisseau : 7,6 à 9 secondes
    if (time >= 7600 && time < 9000) {
        const progress = Math.min(1, (time - 7600) / 1400);
        const eased = this.easeInOutCubic(progress);

        this.ship.x = this.arrivalPortal.x +
        (this.arrivalTarget.x - this.arrivalPortal.x) * eased;

        this.ship.y = this.arrivalPortal.y +
        (this.arrivalTarget.y - this.arrivalPortal.y) * eased;

        this.ship.scale = 0.1 + 0.9 * eased;
        this.ship.rotation = 0;
    }

    // Fermeture du portail : 9 à 9,5 secondes
    if (time >= 9000) {
        const progress = Math.min(1, (time - 9000) / 500);

        this.portal.progress = 1 - this.easeInOutCubic(progress);

        this.ship.x = this.arrivalTarget.x;
        this.ship.y = this.arrivalTarget.y;
        this.ship.scale = 1;
    }
  }
  skip() {
    if (!this.active) {
      return;
    }

    this.finish();
  }

  finish() {
    this.active = false;
    this.finished = true;
  }

  /*═══════════════════════════════════════════════════════
                           DRAW
  ═══════════════════════════════════════════════════════*/
	drawPreview(ctx) {
		ctx.save();

		// Fond spatial
		ctx.fillStyle = "#02030c";
		ctx.fillRect(0, 0, this.width, this.height);

		this.background.draw(ctx);

		// Première image de l'introduction
		this.drawPlanet(ctx);
		this.drawTree(ctx);
		this.drawShip(ctx);

		ctx.restore();
	}
	
  draw(ctx) {
    if (!this.active || this.finished) {
      return;
    }

    ctx.save();

		if (this.elapsed >= 7000) {
			this.drawArrival(ctx);
			ctx.restore();
			return;
		}
    // Fond spatial
    ctx.fillStyle = "#02030c";
    ctx.fillRect(0, 0, this.width, this.height);

    this.background.draw(ctx);

    // Planète et végétation
    this.drawPlanet(ctx);
    this.drawTree(ctx);

    // Portail
    if (this.elapsed >= 2000) {
      this.drawPortal(ctx);
    }

    // Vaisseau
    if (this.elapsed < 5500) {
      this.drawShip(ctx);
    }

    // Transition finale
    this.drawTransition(ctx);

    ctx.restore();
  }

	drawArrival(ctx) {
		// Même fond étoilé que le jeu
		// Effacer complètement l'image précédente
		ctx.fillStyle = "#02030c";
		ctx.fillRect(0, 0, this.width, this.height);

		// Dessiner le fond étoilé
		this.background.draw(ctx);

		// Le portail est placé dans le monde du jeu
		this.portal.x = this.arrivalPortal.x;
		this.portal.y = this.arrivalPortal.y;

		// Le portail est derrière le vaisseau
		this.drawPortal(ctx);

		if (this.elapsed >= 7600) {
			this.drawShip(ctx);
		}

		// Fondu depuis le noir : 7 à 7,5 secondes
		if (this.elapsed < 7500) {
			const progress = (this.elapsed - 7000) / 500;

			ctx.fillStyle = `rgba(0, 0, 0, ${1 - progress})`;
			ctx.fillRect(0, 0, this.width, this.height);
		}
	}
  /*═══════════════════════════════════════════════════════
                           PLANET
  ═══════════════════════════════════════════════════════*/

  drawPlanet(ctx) {
    const { x, y, radius } = this.planet;

    ctx.save();

    // Halo atmosphérique
    const atmosphere = ctx.createRadialGradient(
      x, y, radius * 0.7,
      x, y, radius * 1.35
    );

    atmosphere.addColorStop(0, "rgba(70, 255, 120, 0.18)");
    atmosphere.addColorStop(1, "rgba(70, 255, 120, 0)");

    ctx.fillStyle = atmosphere;

    ctx.beginPath();
    ctx.arc(x, y, radius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Surface de la planète
    const gradient = ctx.createRadialGradient(
      x - radius * 0.35,
      y - radius * 0.45,
      radius * 0.1,
      x,
      y,
      radius
    );

    gradient.addColorStop(0, "#9cff72");
    gradient.addColorStop(0.45, "#46bb54");
    gradient.addColorStop(1, "#126b38");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Contour lumineux
    ctx.strokeStyle = "rgba(130, 255, 150, 0.55)";
    ctx.lineWidth = 2;

    ctx.stroke();

    // Petites zones de végétation
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "rgba(20, 100, 40, 0.25)";

    for (let i = 0; i < 9; i++) {
      const angle = i * 2.4;

      const px = x + Math.cos(angle) * radius * 0.6;
      const py = y + Math.sin(angle) * radius * 0.6;

      ctx.beginPath();
      ctx.ellipse(
        px,
        py,
        radius * 0.18,
        radius * 0.08,
        angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
    ctx.restore();
  }

  /*═══════════════════════════════════════════════════════
                            TREE
  ═══════════════════════════════════════════════════════*/

  drawTree(ctx) {
    const planet = this.planet;

    const x = planet.x - planet.radius * 0.38;

    // Position sur la courbure de la planète
    const offsetX = x - planet.x;

    const y = planet.y - Math.sqrt(
      planet.radius * planet.radius - offsetX * offsetX
    );

    const treeHeight = planet.radius * 0.55;

    ctx.save();

    ctx.translate(x, y);

    // Inclinaison suivant la courbure du globe
    ctx.rotate(-0.15);

    // Tronc
    ctx.strokeStyle = "#754321";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -treeHeight);
    ctx.stroke();

    // Branches
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(0, -treeHeight * 0.6);
    ctx.lineTo(-17, -treeHeight * 0.85);

    ctx.moveTo(0, -treeHeight * 0.7);
    ctx.lineTo(18, -treeHeight * 0.95);

    ctx.stroke();

    // Feuillage
    const leaves = [
      { x: -17, y: -treeHeight, r: 19 },
      { x: 16, y: -treeHeight, r: 20 },
      { x: 0, y: -treeHeight - 13, r: 23 }
    ];

    for (const leaf of leaves) {
      const gradient = ctx.createRadialGradient(
        leaf.x - 5,
        leaf.y - 6,
        2,
        leaf.x,
        leaf.y,
        leaf.r
      );

      gradient.addColorStop(0, "#aaff66");
      gradient.addColorStop(1, "#218b36");

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc(
        leaf.x,
        leaf.y,
        leaf.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Pommes rouges
    const apples = [
      { x: -17, y: -treeHeight + 7 },
      { x: 15, y: -treeHeight - 5 },
      { x: 2, y: -treeHeight - 22 },
      { x: 23, y: -treeHeight + 10 }
    ];

    for (const apple of apples) {
      ctx.fillStyle = "#ff3030";

      ctx.beginPath();
      ctx.arc(
        apple.x,
        apple.y,
        4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Reflet sur les pommes
      ctx.fillStyle = "#ffaaaa";

      ctx.beginPath();
      ctx.arc(
        apple.x - 1,
        apple.y - 1,
        1.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  /*═══════════════════════════════════════════════════════
                           PORTAL
  ═══════════════════════════════════════════════════════*/

  drawPortal(ctx) {
    const portal = this.portal;

    const progress = portal.progress;

    if (progress <= 0) {
      return;
    }

    const radius = portal.radius * progress;

    ctx.save();

    ctx.translate(portal.x, portal.y);
    ctx.rotate(portal.rotation);

    ctx.globalAlpha = progress;

    // Halo extérieur
    ctx.shadowColor = "#8844ff";
    ctx.shadowBlur = 25;

    ctx.strokeStyle = "#8844ff";
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Anneau cyan
    ctx.shadowColor = "#00e5ff";
    ctx.shadowBlur = 18;

    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // Intérieur du portail
    const gradient = ctx.createRadialGradient(
      0, 0, 0,
      0, 0, radius * 0.8
    );

    gradient.addColorStop(0, "#02030c");
    gradient.addColorStop(0.6, "#251052");
    gradient.addColorStop(1, "#0088cc");

    ctx.shadowBlur = 0;
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
    ctx.fill();

    // Anneaux énergétiques
    ctx.strokeStyle = "rgba(200, 120, 255, 0.7)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      const ringRadius = radius * (0.35 + i * 0.17);

      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        ringRadius,
        ringRadius * 0.55,
        portal.rotation * 2 + i,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    // Particules orbitales
    for (const particle of this.particles) {
      const angle =
        particle.angle +
        portal.rotation * particle.speed;

      const distance = particle.distance * progress;

      const px = Math.cos(angle) * distance;
      const py = Math.sin(angle) * distance;

      ctx.fillStyle =
        particle.speed > 0.8 ? "#00e5ff" : "#bb44ff";

      ctx.beginPath();

      ctx.arc(
        px,
        py,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    ctx.restore();
  }

  /*═══════════════════════════════════════════════════════
                            SHIP
  ═══════════════════════════════════════════════════════*/

  drawShip(ctx) {
    const ship = this.ship;

    if (ship.scale <= 0) {
      return;
    }

    ctx.save();

    ctx.translate(ship.x, ship.y);

    ctx.rotate(ship.rotation);

    ctx.scale(ship.scale, ship.scale);

    // Position locale pour réutiliser Player.draw()
    this.player.x = 0;
    this.player.y = 0;

    this.player.draw(ctx);

    ctx.restore();
  }

  /*═══════════════════════════════════════════════════════
                         TRANSITION
  ═══════════════════════════════════════════════════════*/

  drawTransition(ctx) {
    const time = this.elapsed;

    // Flash lumineux : 5,5 à 5,8 secondes
    if (time >= 5500 && time < 5800) {
      const progress = (time - 5500) / 300;

      const alpha = Math.sin(progress * Math.PI);

      ctx.save();

      ctx.fillStyle = `rgba(220, 240, 255, ${alpha})`;

      ctx.fillRect(
        0,
        0,
        this.width,
        this.height
      );

      ctx.restore();
    }

    // Fondu au noir : 5,8 à 6,5 secondes
    if (time >= 5800 && time < 6500) {
      const progress = (time - 5800) / 700;

      ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;

      ctx.fillRect(
        0,
        0,
        this.width,
        this.height
      );
    }

    // Écran noir jusqu'à la fin
    if (time >= 6500 && time < 7000) {
      ctx.fillStyle = "#000000";

      ctx.fillRect(
        0,
        0,
        this.width,
        this.height
      );
    }
  }

  /*═══════════════════════════════════════════════════════
                          UTILITIES
  ═══════════════════════════════════════════════════════*/

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}