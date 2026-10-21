import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_MOVE_SPEED,
  PLAYER_WIDTH,
  PLAYER_HEIGHT
} from "./config.js";

import { keys } from "./input.js";

export class Player {
  constructor() {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.speed = PLAYER_MOVE_SPEED;
    this.weaponLevel = 1;
    this.upgradeGlow = 0;

    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - 70;
  }

  reset() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT - 70;

    this.weaponLevel = 1;
    this.upgradeGlow = 0;
  }

  update() {
    let dx = 0;
    let dy = 0;

    if (keys.left) {
      dx -= 1;
    }

    if (keys.right) {
      dx += 1;
    }

    if (keys.up) {
      dy -= 1;
    }

    if (keys.down) {
      dy += 1;
    }

  // Normalisation diagonale
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    const halfWidth = this.width / 2;
    const topLimit = this.width / 2;
    const bottomLimit = CANVAS_HEIGHT - this.width;

    if (this.x - halfWidth < 0) {
      this.x = halfWidth;
    }

    if (this.x + halfWidth > CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - halfWidth;
    }

    if (this.y < topLimit) {
      this.y = topLimit;
    }

    if (this.y > bottomLimit) {
      this.y = bottomLimit;
    }
  }
  getHitbox() {
    return {
      x: this.x - this.width * 0.32,
      y: this.y - this.width * 0.25,
      width: this.width * 0.64,
      height: this.width * 1.25
    };
  }
  setWeaponLevel(level) {
    if (level > this.weaponLevel) {
      this.upgradeGlow = 60;
    }

    this.weaponLevel = level;
  }

  updateUpgradeGlow() {
    if (this.upgradeGlow > 0) {
      this.upgradeGlow--;
    }
  }

   draw(ctx) {
    const x = this.x;
    const y = this.y;
    const s = this.width / 2;

    ctx.save();
    ctx.translate(x, y);

    const triple = this.weaponLevel >= 3;
    const double = this.weaponLevel >= 2;
    const energyColor = triple ? "#bb44ff" : "#00cfff";

  // Corps principal
    ctx.fillStyle = "#e6f1ff";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(-s, s * 0.9);
    ctx.lineTo(0, s * 0.45);
    ctx.lineTo(s, s * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  // Partie centrale
    ctx.fillStyle = "#b8c7d9";
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.75);
    ctx.lineTo(-s * 0.35, s * 0.55);
    ctx.lineTo(0, s * 0.35);
    ctx.lineTo(s * 0.35, s * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  // Cockpit
    ctx.fillStyle = energyColor;
    ctx.strokeStyle = "#003344";

    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.lineTo(-s * 0.18, s * 0.15);
    ctx.lineTo(0, s * 0.35);
    ctx.lineTo(s * 0.18, s * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  // Ailes latérales sombres
    ctx.fillStyle = "#2c3440";

    ctx.beginPath();
    ctx.moveTo(-s * 0.55, s * 0.25);
    ctx.lineTo(-s * 0.95, s * 0.75);
    ctx.lineTo(-s * 0.25, s * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(s * 0.55, s * 0.25);
    ctx.lineTo(s * 0.95, s * 0.75);
    ctx.lineTo(s * 0.25, s * 0.55);
    ctx.closePath();
    ctx.fill();

    // Modules d'armement supplémentaires
  if (double) {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);

      // Support métallique latéral
      ctx.fillStyle = "#2c3440";
      ctx.strokeStyle = "#a8bacd";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(s * 0.65, s * 0.2);
      ctx.lineTo(s * 1.12, s * 0.1);
      ctx.lineTo(s * 1.2, s * 0.75);
      ctx.lineTo(s * 0.8, s * 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Canon latéral
      ctx.fillStyle = "#dce8f5";
      ctx.fillRect(s * 1.02, -s * 0.05, s * 0.14, s * 0.55);

      // Énergie du canon
      ctx.fillStyle = energyColor;
      ctx.shadowColor = energyColor;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(s * 1.09, -s * 0.3);
      ctx.lineTo(s * 0.98, s * 0.05);
      ctx.lineTo(s * 1.2, s * 0.05);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  // Armement renforcé du triple tir
  if (triple) {
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);

      // Blindage supplémentaire
      ctx.fillStyle = "#454052";
      ctx.strokeStyle = "#b8a0d8";
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(s * 0.75, s * 0.45);
      ctx.lineTo(s * 1.28, s * 0.65);
      ctx.lineTo(s * 1.1, s * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Noyau énergétique violet
      ctx.fillStyle = "#bb44ff";
      ctx.shadowColor = "#bb44ff";
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(s * 0.92, s * 0.42);
      ctx.lineTo(s * 1.12, s * 0.58);
      ctx.lineTo(s * 0.95, s * 0.72);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }
  // Réacteurs
    ctx.fillStyle = "#00e5ff";
    ctx.fillRect(-s * 0.45, s * 0.82, s * 0.22, s * 0.45);
    ctx.fillRect(s * 0.23, s * 0.82, s * 0.22, s * 0.45);

  // Flammes
    ctx.fillStyle = "#008cff";
    ctx.beginPath();
    ctx.moveTo(-s * 0.34, s * 1.35);
    ctx.lineTo(-s * 0.48, s * 0.95);
    ctx.lineTo(-s * 0.2, s * 0.95);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(s * 0.34, s * 1.35);
    ctx.lineTo(s * 0.2, s * 0.95);
    ctx.lineTo(s * 0.48, s * 0.95);
    ctx.closePath();
    ctx.fill();

        // Flash lumineux lors d'une amélioration
    if (this.upgradeGlow > 0) {
      const progress = this.upgradeGlow / 60;
      const intensity = Math.sin(progress * Math.PI);

      ctx.save();

      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
      ctx.fillRect(-s * 1.5, -s * 1.5, s * 3, s * 3);

      ctx.restore();
    }
    ctx.restore();
  }
  
 drawShield(ctx) {
  ctx.save();

  const x = this.x;
  const y = this.y;
  const radius = this.width * 0.95;

  const isPurple = this.weaponLevel >= 3;

  const shieldColor = isPurple ? "#bb44ff" : "#00ccff";
  const electricColor = isPurple ? "#e0aaff" : "#6666ff";

  // Animation basée sur le temps
  const time = performance.now() * 0.001;

  // ═══════════════════════════════════════
  // MEMBRANE ÉNERGÉTIQUE
  // ═══════════════════════════════════════

  const membrane = ctx.createRadialGradient(
    x, y, radius * 0.3,
    x, y, radius
  );

  membrane.addColorStop(0, "rgba(0, 30, 90, 0)");
  membrane.addColorStop(
    0.75,
    isPurple
      ? "rgba(100, 20, 150, 0.06)"
      : "rgba(0, 80, 180, 0.06)"
  );
  membrane.addColorStop(
    1,
    isPurple
      ? "rgba(150, 40, 255, 0.18)"
      : "rgba(0, 150, 255, 0.18)"
  );

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = membrane;
  ctx.fill();

  // ═══════════════════════════════════════
  // CONTOUR PRINCIPAL
  // ═══════════════════════════════════════

  ctx.strokeStyle = shieldColor;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.85;

  ctx.shadowColor = shieldColor;
  ctx.shadowBlur = 4;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.shadowBlur = 0;

  // ═══════════════════════════════════════
  // ARCS ÉLECTRIQUES
  // ═══════════════════════════════════════

  ctx.strokeStyle = electricColor;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.75;

  // Plusieurs arcs répartis autour du bouclier
  for (let i = 0; i < 6; i++) {
    const startAngle =
      (Math.PI * 2 / 6) * i + time * 0.35;

    const arcLength = 0.45;

    ctx.beginPath();

    for (let j = 0; j <= 8; j++) {
      const progress = j / 8;
      const angle = startAngle + progress * arcLength;

      // Variation de rayon pour créer un éclair
      const variation =
        Math.sin(j * 4.7 + i * 3.2 + time * 8) * 2;

      const r = radius - 3 + variation;

      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      if (j === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();
  }

  // ═══════════════════════════════════════
  // REFLETS ÉNERGÉTIQUES
  // ═══════════════════════════════════════

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.65;

  for (let i = 0; i < 3; i++) {
    const angle = time * 0.25 + i * (Math.PI * 2 / 3);

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      radius,
      angle,
      angle + 0.22
    );
    ctx.stroke();
  }

  ctx.restore();
}
}
