import { CANVAS_WIDTH,
         CANVAS_HEIGHT
 } from "./config.js";

export class EyeBoss {
  constructor() {
    this.width = 120;
    this.height = 120;
    this.x = CANVAS_WIDTH / 2 - this.width / 2;
    this.y = -140;

    this.speed = 1;
    this.direction = 1;
    this.active = true;

    this.health = 120;
    this.maxHealth = 120;

    this.state = "entering";
    this.attackTimer = 220;
  }

  update() {
    if (this.state === "entering") {
      this.y += this.speed;

      if (this.y >= 40) {
        this.y = 40;
        this.state = "fighting";
      }

      return;
    }

    if (this.state === "fighting") {
      this.x += this.direction * 2.2;

      if (this.x <= 40 || this.x + this.width >= CANVAS_WIDTH - 40) {
        this.direction *= -1;
      }

      this.attackTimer--;
    }
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    const r = this.width / 2;
    const TAU = Math.PI * 2;

    // ═══════════════════════════════════════
    // 1. CORPS COSMIQUE
    // ═══════════════════════════════════════

    const body = ctx.createRadialGradient(
      -r * 0.3, -r * 0.35, r * 0.05,
      0, 0, r
    );

    body.addColorStop(0, "#7422a0");
    body.addColorStop(0.35, "#39065e");
    body.addColorStop(0.75, "#170025");
    body.addColorStop(1, "#070010");

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fillStyle = body;
    ctx.fill();

    // ═══════════════════════════════════════
    // 2. TEXTURE COSMIQUE
    // ═══════════════════════════════════════

    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, r - 2, 0, TAU);
    ctx.clip();

    // Filaments énergétiques
    ctx.strokeStyle = "rgba(190, 65, 255, 0.22)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * TAU;

      const x1 = Math.cos(angle) * r * 0.35;
      const y1 = Math.sin(angle) * r * 0.35;

      const x2 = Math.cos(angle + 0.5) * r * 0.8;
      const y2 = Math.sin(angle + 0.5) * r * 0.8;

      ctx.beginPath();
      ctx.moveTo(x1, y1);

      ctx.quadraticCurveTo(
        Math.cos(angle + 0.2) * r * 0.65,
        Math.sin(angle + 0.2) * r * 0.65,
        x2,
        y2
      );

      ctx.stroke();
    }

    // Étoiles internes
    ctx.fillStyle = "rgba(230, 170, 255, 0.7)";

    for (let i = 0; i < 14; i++) {
      const angle = i * 2.4;
      const distance = r * (0.3 + (i % 5) * 0.12);

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 1.5 : 0.8, 0, TAU);
      ctx.fill();
    }

    ctx.restore();

    // ═══════════════════════════════════════
    // 3. ANNEAUX COSMIQUES
    // ═══════════════════════════════════════

    // Anneau principal
    ctx.strokeStyle = "#a735e8";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, r + 5, 0, TAU);
    ctx.stroke();

    // Anneau secondaire
    ctx.strokeStyle = "rgba(255, 80, 220, 0.65)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, r + 10, 0.3, Math.PI * 1.8);
    ctx.stroke();

    // Orbite inclinée
    ctx.save();
    ctx.rotate(-0.4);

    ctx.strokeStyle = "rgba(220, 90, 255, 0.5)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.ellipse(
      0, 0,
      r + 15,
      r * 0.55,
      0, 0, TAU
    );
    ctx.stroke();

    ctx.restore();

    // ═══════════════════════════════════════
    // 4. FORME ORGANIQUE DE L'ŒIL
    // ═══════════════════════════════════════

    const eyeY = -r * 0.05;
    const eyeW = r * 0.68;
    const eyeH = r * 0.27;

    // Contour sombre
    ctx.beginPath();
    ctx.moveTo(-eyeW, eyeY);

    ctx.quadraticCurveTo(
      0, eyeY - eyeH * 1.6,
      eyeW, eyeY
    );

    ctx.quadraticCurveTo(
      0, eyeY + eyeH * 1.6,
      -eyeW, eyeY
    );

    ctx.closePath();

    ctx.fillStyle = "#08000f";
    ctx.fill();

    // Blanc de l'œil
    ctx.beginPath();
    ctx.moveTo(-eyeW * 0.92, eyeY);

    ctx.quadraticCurveTo(
      0, eyeY - eyeH * 1.25,
      eyeW * 0.92, eyeY
    );

    ctx.quadraticCurveTo(
      0, eyeY + eyeH * 1.25,
      -eyeW * 0.92, eyeY
    );

    ctx.closePath();

    const sclera = ctx.createLinearGradient(
      0, eyeY - eyeH,
      0, eyeY + eyeH
    );

    // Fond sombre et légèrement rougeâtre
    sclera.addColorStop(0, "#21000d");
    sclera.addColorStop(0.5, "#430014");
    sclera.addColorStop(1, "#100008");

    ctx.fillStyle = sclera;
    ctx.fill();

    // ═══════════════════════════════════════
    // 5. IRIS DÉMONIAQUE
    // ═══════════════════════════════════════

    // Iris légèrement plus grand
    const irisR = r * 0.29;

    // Dégradé rouge incandescent
    const iris = ctx.createRadialGradient(
      0, eyeY, irisR * 0.1,
      0, eyeY, irisR
    );

    iris.addColorStop(0, "#ff5533");
    iris.addColorStop(0.35, "#ff1025");
    iris.addColorStop(0.7, "#b00020");
    iris.addColorStop(1, "#390008");

    ctx.beginPath();
    ctx.arc(0, eyeY, irisR, 0, TAU);
    ctx.fillStyle = iris;
    ctx.fill();

    // ═══════════════════════════════════════
    // FIBRES ÉNERGÉTIQUES ROUGES
    // ═══════════════════════════════════════

    ctx.save();

    ctx.beginPath();
    ctx.arc(0, eyeY, irisR, 0, TAU);
    ctx.clip();

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * TAU;

      const innerR = irisR * 0.35;
      const outerR = irisR * 0.95;

      const startX = Math.cos(angle) * innerR;
      const startY = eyeY + Math.sin(angle) * innerR;

      const endX = Math.cos(angle + 0.12) * outerR;
      const endY = eyeY + Math.sin(angle + 0.12) * outerR;

      ctx.strokeStyle =
        i % 3 === 0
          ? "rgba(255, 170, 80, 0.85)"
          : "rgba(255, 30, 50, 0.75)";

      ctx.lineWidth = i % 4 === 0 ? 1.5 : 0.8;

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      ctx.quadraticCurveTo(
        Math.cos(angle + 0.2) * irisR * 0.7,
        eyeY + Math.sin(angle + 0.2) * irisR * 0.7,
        endX,
        endY
      );

      ctx.stroke();
    }

    ctx.restore();

    // ═══════════════════════════════════════
    // PUPILLE VERTICALE DÉMONIAQUE
    // ═══════════════════════════════════════

    // Contour rouge sombre
    ctx.fillStyle = "#680010";

    ctx.beginPath();

    ctx.moveTo(0, eyeY - irisR * 0.95);

    ctx.quadraticCurveTo(
      irisR * 0.38,
      eyeY,
      0,
      eyeY + irisR * 0.95
    );

    ctx.quadraticCurveTo(
      -irisR * 0.38,
      eyeY,
      0,
      eyeY - irisR * 0.95
    );

    ctx.closePath();
    ctx.fill();

    // Fente noire intérieure
    ctx.fillStyle = "#020003";

    ctx.beginPath();

    ctx.moveTo(0, eyeY - irisR * 0.88);

    ctx.quadraticCurveTo(
      irisR * 0.24,
      eyeY,
      0,
      eyeY + irisR * 0.88
    );

    ctx.quadraticCurveTo(
      -irisR * 0.24,
      eyeY,
      0,
      eyeY - irisR * 0.88
    );

    ctx.closePath();
    ctx.fill();

    // ═══════════════════════════════════════
    // 6. PAUPIÈRES ET FINITIONS
    // ═══════════════════════════════════════

    ctx.strokeStyle = "#22002e";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(-eyeW, eyeY);

    ctx.quadraticCurveTo(
      0, eyeY - eyeH * 1.6,
      eyeW, eyeY
    );

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-eyeW, eyeY);

    ctx.quadraticCurveTo(
      0, eyeY + eyeH * 1.6,
      eyeW, eyeY
    );

    ctx.stroke();

    ctx.restore();
  }
}

export class WormBoss {
  constructor() {
    this.segmentCount = 45;
    this.segmentSpacing = 28;

    this.headRadius = 30;
    this.bodyRadius = 24;
    this.tailRadius = 15;

    this.x = -150;
    this.y = 160;

    this.targetX = 400;
    this.targetY = 250;

    this.speed = 1.7;
    this.active = true;

    this.health = 450;
    this.maxHealth = 450;

    this.state = "entering";

    this.path = [];
    this.segments = [];

    this.targetTimer = 0;
    this.angle = Math.atan2(
      this.targetY - this.y,
      this.targetX - this.x
    );
    this.maxTurnSpeed = 0.026;
    this.curveDirection = Math.random() < 0.5 ? -1 : 1;
    this.curveStrength = 0.35;

    this.justChangedDirection = false;

    this.initializePath();
  }

  // point de départ a suivre pour la tete
  initializePath() {
    const requiredPathLength =
      this.segmentCount * this.segmentSpacing;

    for (let i = 0; i < requiredPathLength; i++) {
      this.path.push({
        x: this.x - i,
        y: this.y
      });
    }

    this.updateSegments();
  }

  update() {
    this.updateSpeed();
    this.updateTarget();
    this.moveHead();
    this.updatePath();
    this.updateSegments();

    if (this.state === "entering" && this.x > 100) {
      this.state = "fighting";
    }
  }

  updateSpeed() {
    const healthRatio = this.health / this.maxHealth;

    if (healthRatio > 0.66) {
      this.speed = 2.4;
    } else if (healthRatio > 0.33) {
      this.speed = 3.1;
    } else {
      this.speed = 4;
    }
  }

  updateTarget() {
    this.targetTimer--;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 60 || this.targetTimer <= 0) {
      this.chooseNewTarget();
    }
  }

  chooseNewTarget() {
    const margin = 100;

    let newX;
    let newY;
    let attempts = 0;

    do {
      newX =
        -margin +
        Math.random() * (CANVAS_WIDTH + margin * 2);

      newY =
        -margin +
        Math.random() * (CANVAS_HEIGHT + margin * 2);

      attempts++;
    } while (
      Math.hypot(newX - this.x, newY - this.y) < 280 &&
      attempts < 20
    );

    this.targetX = newX;
    this.targetY = newY;

    if (Math.random() < 0.45) {
      this.curveDirection *= -1;
    }

    this.curveStrength = 0.2 + Math.random() * 0.45;
    this.targetTimer =
      180 + Math.floor(Math.random() * 180);

      // son du worm devient aléatoire
    if (Math.random() < 0.35) {
      this.justChangedDirection = true;
    }
  }

  moveHead() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    const desiredAngle = Math.atan2(dy, dx);

    let angleDifference = desiredAngle - this.angle;

    // Ramène l'écart entre -PI et PI.
    while (angleDifference > Math.PI) {
      angleDifference -= Math.PI * 2;
    }

    while (angleDifference < -Math.PI) {
      angleDifference += Math.PI * 2;
    }

    // Le boss ne peut pas changer brutalement de direction.
    const limitedTurn = Math.max(
      -this.maxTurnSpeed,
      Math.min(this.maxTurnSpeed, angleDifference)
    );

    this.angle += limitedTurn;

    // Courbure permanente légère donnant un mouvement circulaire.
    this.angle +=
      this.curveDirection *
      this.curveStrength *
      this.maxTurnSpeed;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  updatePath() {
    this.path.unshift({
      x: this.x,
      y: this.y
    });

    const maxPathLength = 1400;

    if (this.path.length > maxPathLength) {
      this.path.length = maxPathLength;
    }
  }

  updateSegments() {
    this.segments = [];

    for (let i = 0; i < this.segmentCount; i++) {
      const targetDistance = i * this.segmentSpacing;
      const position = this.getPathPosition(targetDistance);

      this.segments.push({
        x: position.x,
        y: position.y,
        radius: this.getSegmentRadius(i),
        index: i
      });
    }
  }

  getPathPosition(targetDistance) {
    if (this.path.length === 0) {
      return {
        x: this.x,
        y: this.y
      };
    }

    let travelledDistance = 0;

    for (let i = 1; i < this.path.length; i++) {
      const previous = this.path[i - 1];
      const current = this.path[i];

      const sectionDistance = Math.hypot(
        current.x - previous.x,
        current.y - previous.y
      );

      if (
        travelledDistance + sectionDistance >=
        targetDistance
      ) {
        const remainingDistance =
          targetDistance - travelledDistance;

        const ratio =
          sectionDistance === 0
            ? 0
            : remainingDistance / sectionDistance;

        return {
          x:
            previous.x +
            (current.x - previous.x) * ratio,

          y:
            previous.y +
            (current.y - previous.y) * ratio
        };
      }

      travelledDistance += sectionDistance;
    }

    return this.path[this.path.length - 1];
  }
  getSegmentRadius(index) {
    if (index === 0) {
      return this.headRadius;
    }

    const ratio = index / (this.segmentCount - 1);

    return (
      this.bodyRadius -
      ratio * (this.bodyRadius - this.tailRadius)
    );
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const segment = this.segments[i];

      this.drawSegment(ctx, segment);
    }

    this.drawTailHorns(ctx);
    this.drawHead(ctx);
  }

  drawSegment(ctx, segment) {
    ctx.save();
    ctx.translate(segment.x, segment.y);

    const r = segment.radius;
    const special = segment.index % 3 === 0;

    // Cache des dégradés, créé uniquement au premier dessin
    if (!this.segmentGradients) {
      this.segmentGradients = new Map();
    }

    const key = `${r}-${special}`;

    let armor = this.segmentGradients.get(key);

    if (!armor) {
      armor = ctx.createLinearGradient(-r, -r, r, r);

      if (special) {
        armor.addColorStop(0, "#9783a8");
        armor.addColorStop(0.45, "#554562");
        armor.addColorStop(1, "#211a2b");
      } else {
        armor.addColorStop(0, "#a09b9b");
        armor.addColorStop(0.45, "#625d63");
        armor.addColorStop(1, "#28252e");
      }

      this.segmentGradients.set(key, armor);
    }

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);

      ctx.fillStyle = armor;
      ctx.fill();

      ctx.strokeStyle = "#211b29";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // ═══════════════════════════════════════
      // PLAQUE DE BLINDAGE
      // ═══════════════════════════════════════

      ctx.strokeStyle = "rgba(210, 190, 220, 0.25)";
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.arc(
        -r * 0.08,
        -r * 0.08,
        r * 0.78,
        Math.PI * 1.1,
        Math.PI * 1.85
      );
      ctx.stroke();

      // Jointure sombre
      ctx.strokeStyle = "rgba(15, 10, 22, 0.45)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(
        0,
        0,
        r * 0.87,
        0.15,
        Math.PI * 0.85
      );
      ctx.stroke();

      // ═══════════════════════════════════════
      // NOYAUX ÉNERGÉTIQUES
      // ═══════════════════════════════════════

      if (segment.index % 4 === 0) {
        const orange = segment.index % 8 === 0;

        const coreColor = orange ? "#ff8a32" : "#a94bdf";
        const darkColor = orange ? "#7a3012" : "#47205d";

        // Support métallique
        ctx.fillStyle = "#201622";

        ctx.beginPath();
        ctx.ellipse(
          -r * 0.15,
          r * 0.1,
          r * 0.48,
          r * 0.3,
          0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Noyau
        ctx.fillStyle = coreColor;

        ctx.beginPath();
        ctx.ellipse(
          -r * 0.15,
          r * 0.1,
          r * 0.38,
          r * 0.22,
          0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Reflet
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";

        ctx.beginPath();
        ctx.ellipse(
          -r * 0.24,
          0,
          r * 0.13,
          r * 0.055,
          0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
    }

  drawHead(ctx) {
    const head = this.segments[0];

    if (!head) {
      return;
    }

    const nextSegment = this.segments[1];

    const angle = nextSegment
      ? Math.atan2(
          head.y - nextSegment.y,
          head.x - nextSegment.x
        )
      : 0;

    ctx.save();

    ctx.translate(head.x, head.y);
    ctx.rotate(angle);

    const r = this.headRadius;

    // ═══════════════════════════════════════
    // CARAPACE PRINCIPALE
    // ═══════════════════════════════════════

    // Dégradé de la tête créé une seule fois
    if (!this.headArmorGradient) {
      this.headArmorGradient = ctx.createRadialGradient(
        -r * 0.3,
        -r * 0.35,
        r * 0.1,
        0,
        0,
        r
      );

      this.headArmorGradient.addColorStop(0, "#aaa1b0");
      this.headArmorGradient.addColorStop(0.45, "#62576b");
      this.headArmorGradient.addColorStop(0.8, "#302638");
      this.headArmorGradient.addColorStop(1, "#15101d");
    }

    const armor = this.headArmorGradient;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);

    ctx.fillStyle = armor;
    ctx.fill();

    ctx.strokeStyle = "#211826";
    ctx.lineWidth = 3;
    ctx.stroke();

    // ═══════════════════════════════════════
    // PLAQUES DE BLINDAGE
    // ═══════════════════════════════════════

    ctx.strokeStyle = "rgba(210, 180, 225, 0.5)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(
      -r * 0.1,
      0,
      r * 0.8,
      Math.PI * 1.15,
      Math.PI * 1.75
    );
    ctx.stroke();

    ctx.strokeStyle = "#39263f";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-r * 0.45, -r * 0.5);
    ctx.lineTo(-r * 0.2, -r * 0.25);
    ctx.lineTo(r * 0.05, -r * 0.4);
    ctx.stroke();

    // ═══════════════════════════════════════
    // BOUCHE
    // ═══════════════════════════════════════

    ctx.fillStyle = "#10060f";

    ctx.beginPath();
    ctx.ellipse(
      r * 0.35,
      0,
      r * 0.55,
      r * 0.68,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Profondeur intérieure
  // Dégradé de la bouche créé une seule fois
  if (!this.mouthGradient) {
    this.mouthGradient = ctx.createRadialGradient(
      r * 0.3,
      0,
      r * 0.05,
      r * 0.35,
      0,
      r * 0.65
    );

    this.mouthGradient.addColorStop(0, "#050006");
    this.mouthGradient.addColorStop(0.6, "#210715");
    this.mouthGradient.addColorStop(1, "#4c1637");
  }

  const mouth = this.mouthGradient;

    ctx.beginPath();
    ctx.ellipse(
      r * 0.35,
      0,
      r * 0.49,
      r * 0.61,
      0,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = mouth;
    ctx.fill();

    // Bordure de la mâchoire
    ctx.strokeStyle = "#6e4a75";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(
      r * 0.35,
      0,
      r * 0.55,
      r * 0.68,
      0,
      -Math.PI * 0.5,
      Math.PI * 0.5
    );
    ctx.stroke();

    this.drawTeeth(ctx);

    ctx.restore();
  }

drawTeeth(ctx) {
  const toothCount = 8;

  // Cache des dégradés des crocs
  if (!this.toothGradients) {
    this.toothGradients = [];

    for (let i = 0; i < toothCount; i++) {
      const offset =
        -18 + i * (36 / (toothCount - 1));

      const length = i % 2 === 0 ? 15 : 12;

      const tooth = ctx.createLinearGradient(
        16,
        offset,
        16 + length,
        offset
      );

      tooth.addColorStop(0, "#8f8291");
      tooth.addColorStop(0.4, "#d7c9c5");
      tooth.addColorStop(1, "#fff3df");

      this.toothGradients.push(tooth);
    }
  }

  // Dessin des crocs
  for (let i = 0; i < toothCount; i++) {
    const offset =
      -18 + i * (36 / (toothCount - 1));

    const length = i % 2 === 0 ? 15 : 12;

    ctx.beginPath();

    ctx.moveTo(16, offset - 3.5);

    ctx.quadraticCurveTo(
      23,
      offset - 4,
      16 + length,
      offset + 1
    );

    ctx.quadraticCurveTo(
      22,
      offset + 3,
      16,
      offset + 3.5
    );

    ctx.closePath();

    ctx.fillStyle = this.toothGradients[i];
    ctx.fill();

    ctx.strokeStyle = "#4a3745";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
}

  drawTailHorns(ctx) {
    const tail = this.segments[this.segments.length - 1];
    const previous =
      this.segments[this.segments.length - 2];

    if (!tail || !previous) {
      return;
    }

    const angle = Math.atan2(
      tail.y - previous.y,
      tail.x - previous.x
    );

    ctx.save();

    ctx.translate(tail.x, tail.y);
    ctx.rotate(angle);

    const hornAngles = [-0.55, 0, 0.55];

    for (const hornAngle of hornAngles) {
      ctx.save();
      ctx.rotate(hornAngle);

      // Dégradé partagé par les trois cornes
      if (!this.hornGradient) {
        this.hornGradient = ctx.createLinearGradient(
          -34, -5,
          -5, 5
        );

        this.hornGradient.addColorStop(0, "#fff4e5");
        this.hornGradient.addColorStop(0.5, "#c6b6b6");
        this.hornGradient.addColorStop(1, "#655563");
      }

      const horn = this.hornGradient;

      ctx.beginPath();

      ctx.moveTo(-5, -5);

      ctx.quadraticCurveTo(
        -20,
        -7,
        -34,
        0
      );

      ctx.quadraticCurveTo(
        -20,
        3,
        -5,
        5
      );

      ctx.closePath();

      ctx.fillStyle = horn;
      ctx.fill();

      ctx.strokeStyle = "#4a3947";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }
}

export class DragonBoss {
  constructor() {
    this.width = 300;
    this.height = 145;
    this.renderScale = 0.7;

    this.x = CANVAS_WIDTH / 2 - this.width / 2;
    this.y = -this.height;

    this.targetY = 40;

    this.speed = 1;
    this.horizontalSpeed = 1.25;
    this.direction = 1;

    this.directionChangeCooldown = 0;
    this.randomTurnChance = 0.005;

    this.active = true;

    this.health = 800;
    this.maxHealth = 800;
    this.attackTimer = 110;
    this.state = "entering";
    this.phase = 1;

    this.animationFrame = 0;

    this.wingAngle = 0;
    this.mouthOpen = 0;
    this.eyeGlow = 0;

    this.mouthTimer = 120;
    this.mouthState = "closed";

    this.phase = 1;
    this.phaseThreeStarted = false;

    this.centerTargetX =
      CANVAS_WIDTH / 2 - this.width / 2;

    this.centerTargetY = 55;
  }

  update() {
    this.animationFrame++;

    this.updateWings();
    this.updateEyes();
    this.updateMouth();

    if (
      this.phase === 1 &&
      this.health <= this.maxHealth * 0.55
    ) {
      this.phase = 2;
    }
    if (
      this.phase === 2 &&
      this.health <= this.maxHealth * 0.25
    ) {
      this.phase = 3;
      this.phaseThreeStarted = true;

      this.centerTargetX =
        CANVAS_WIDTH / 2 - this.width / 2;

      this.centerTargetY = 40;

      this.attackTimer = 80;
    }

    if (this.state === "entering") {
      this.updateEntering();
      return;
    }

    if (this.state === "fighting") {

      if (this.phase === 1) {
        this.updateHorizontalMovement();

        if (this.attackTimer > 0) {
          this.attackTimer--;
        }
      } else if (this.phase === 2) {
        this.updatePhaseTwoPosition();
      } else if (this.phase === 3) {
        this.updatePhaseThreePosition();

        if (this.attackTimer > 0) {
          this.attackTimer--;
        }
      }
    }
  }

  updateEntering() {
    this.y += this.speed;

    if (this.y >= this.targetY) {
      this.y = this.targetY;
      this.state = "fighting";
    }
  }

  updateHorizontalMovement() {
    this.x += this.horizontalSpeed * this.direction;

    const leftLimit = 25;
    const rightLimit =
      CANVAS_WIDTH - this.width - 25;

    // Comportement classique aux extrémités
    if (this.x <= leftLimit) {
      this.x = leftLimit;
      this.direction = 1;
    } else if (this.x >= rightLimit) {
      this.x = rightLimit;
      this.direction = -1;
    }

    // Délai entre deux inversions aléatoires
    if (this.directionChangeCooldown > 0) {
      this.directionChangeCooldown--;
      return;
    }

    // Inversion aléatoire avant d'atteindre les limites
    const margin = 100;

    const canTurn =
      this.x > leftLimit + margin &&
      this.x < rightLimit - margin;

    if (
      canTurn &&
      Math.random() < this.randomTurnChance
    ) {
      this.direction *= -1;
      this.directionChangeCooldown = 90;
    }
  }
  updatePhaseTwoPosition() {

      const dx =
          this.centerTargetX - this.x;

      const dy =
          this.centerTargetY - this.y;

      const distance =
          Math.hypot(dx, dy);

      if (distance < 2) {

          this.x = this.centerTargetX;
          this.y = this.centerTargetY;

          return;
      }

      this.x += dx * 0.05;
      this.y += dy * 0.05;
  }
  updatePhaseThreePosition() {
    const dx = this.centerTargetX - this.x;
    const dy = this.centerTargetY - this.y;

    const distance = Math.hypot(dx, dy);

    if (distance < 2) {
      this.x = this.centerTargetX;
      this.y = this.centerTargetY;
      return;
    }

    this.x += dx * 0.06;
    this.y += dy * 0.06;
  }
  updateWings() {
    this.wingAngle =
      Math.sin(this.animationFrame * 0.045) * 0.22;
  }

  updateEyes() {
    this.eyeGlow =
      0.75 +
      Math.sin(this.animationFrame * 0.08) * 0.25;
  }

  updateMouth() {
    this.mouthTimer--;

    if (
      this.mouthState === "closed" &&
      this.mouthTimer <= 0
    ) {
      this.mouthState = "opening";
    }

    if (this.mouthState === "opening") {
      this.mouthOpen += 0.035;

      if (this.mouthOpen >= 1) {
        this.mouthOpen = 1;
        this.mouthState = "open";
        this.mouthTimer = 35;
      }
    }

    if (this.mouthState === "open") {
      this.mouthTimer--;

      if (this.mouthTimer <= 0) {
        this.mouthState = "closing";
      }
    }

    if (this.mouthState === "closing") {
      this.mouthOpen -= 0.035;

      if (this.mouthOpen <= 0) {
        this.mouthOpen = 0;
        this.mouthState = "closed";
        this.mouthTimer =
          100 + Math.floor(Math.random() * 100);
      }
    }
  }

  getMouthPosition() {
    const centerX =
      this.x + this.width / 2;

    const centerY =
      this.y + 105;

    return {
      x: centerX,
      y:
        centerY +
        48 * this.renderScale
    };
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.active = false;
    }
  }

  getMainColor() {
    if (this.phase === 3) {
      return "#b84f18";
    }

    return "#245b87";
  } 
  draw(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + 105;

    ctx.save();

    ctx.translate(centerX, centerY);

    ctx.scale(
      this.renderScale,
      this.renderScale
    );
    this.drawWings(ctx);
    this.drawBody(ctx);
    this.drawArms(ctx);
    this.drawHead(ctx);

    ctx.restore();
  }

  drawWings(ctx) {
    this.drawWing(ctx, -1);
    this.drawWing(ctx, 1);
  }

  drawWing(ctx, side) {
    ctx.save();
    ctx.scale(side, 1);
    ctx.rotate(this.wingAngle * 0.45);

    const phase3 = this.phase === 3;
    const membrane = ctx.createLinearGradient(38, 18, 218, -102);
    if (phase3) {
      membrane.addColorStop(0, "#8c2f12");
      membrane.addColorStop(0.5, "#5e180c");
      membrane.addColorStop(1, "#260806");
    } else {
      membrane.addColorStop(0, "#174a78");
      membrane.addColorStop(0.5, "#0d3158");
      membrane.addColorStop(1, "#071a33");
    }

    const rimColor = phase3 ? "#d87842" : "#568dbd";
    const boneColor = phase3 ? "#a54825" : "#3976a4";
    const veinColor = phase3 ? "#7a2a18" : "#28577f";
    const accentColor = phase3 ? "#ff9755" : "#55a9dc";

    ctx.fillStyle = membrane;
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Bord supérieur courbe et ascendant ; bord inférieur en trois festons.
    ctx.beginPath();
    ctx.moveTo(35, -20);
    ctx.bezierCurveTo(51, -50, 70, -71, 94, -82);
    ctx.bezierCurveTo(126, -99, 168, -111, 220, -116);
    ctx.quadraticCurveTo(215, -99, 205, -83);
    ctx.quadraticCurveTo(199, -65, 194, -43);
    ctx.quadraticCurveTo(176, -28, 166, 13);
    ctx.quadraticCurveTo(151, -2, 137, -8);
    ctx.quadraticCurveTo(128, 10, 116, 43);
    ctx.quadraticCurveTo(102, 24, 86, 15);
    ctx.quadraticCurveTo(77, 34, 61, 60);
    ctx.quadraticCurveTo(56, 30, 45, 14);
    ctx.quadraticCurveTo(39, 1, 35, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Armature principale ascendante et effilée.
    ctx.strokeStyle = boneColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(38, -18);
    ctx.bezierCurveTo(62, -61, 119, -100, 216, -114);
    ctx.stroke();

    // Nervures alignées sur les pointes du bord festonné.
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(69, -60);
    ctx.quadraticCurveTo(137, -55, 194, -43);
    ctx.moveTo(66, -55);
    ctx.quadraticCurveTo(124, -31, 166, 13);
    ctx.moveTo(61, -48);
    ctx.quadraticCurveTo(96, -12, 116, 43);
    ctx.moveTo(55, -40);
    ctx.quadraticCurveTo(67, 4, 61, 60);
    ctx.stroke();

    // Articulations discrètes, sans ombre ni filtre.
    ctx.fillStyle = phase3 ? "#bd5c30" : "#4a87b2";
    for (const joint of [[67, -59, 4.5], [108, -87, 4], [158, -103, 3.5]]) {
      ctx.beginPath();
      ctx.arc(joint[0], joint[1], joint[2], 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(71, -64);
    ctx.bezierCurveTo(111, -91, 162, -106, 207, -110);
    ctx.moveTo(72, -52);
    ctx.quadraticCurveTo(124, -29, 161, 9);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Serre terminale.
    ctx.fillStyle = "#d5dde3";
    ctx.strokeStyle = "#667582";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(211, -116);
    ctx.quadraticCurveTo(231, -128, 237, -122);
    ctx.quadraticCurveTo(226, -108, 212, -101);
    ctx.quadraticCurveTo(218, -110, 211, -116);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawBody(ctx) {
    const gradient = ctx.createLinearGradient(
      0,
      -10,
      0,
      125
    );

    gradient.addColorStop(0, "#245985");
    gradient.addColorStop(1, "#102f50");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#5f8faf";
    ctx.lineWidth = 2.5;

    ctx.beginPath();

    ctx.moveTo(-43, 2);

    ctx.quadraticCurveTo(
      -49,
      54,
      -30,
      105
    );

    ctx.quadraticCurveTo(
      -15,
      126,
      0,
      134
    );

    ctx.quadraticCurveTo(
      15,
      126,
      30,
      105
    );

    ctx.quadraticCurveTo(
      49,
      54,
      43,
      2
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Plaques ventrales.
    ctx.fillStyle = "#356f9a";

    for (let i = 0; i < 4; i++) {
      const plateY = 42 + i * 20;
      const plateWidth = 21 - i * 2;

      ctx.beginPath();

      ctx.moveTo(-plateWidth, plateY);
      ctx.lineTo(0, plateY + 10);
      ctx.lineTo(plateWidth, plateY);
      ctx.lineTo(0, plateY + 17);

      ctx.closePath();
      ctx.fill();
    }

    // ═══════════════════════════════════════
    // ACCENTS ÉNERGÉTIQUES DU TORSE
    // ═══════════════════════════════════════

    ctx.save();

    ctx.strokeStyle =
      this.phase === 3 ? "#ff9b54" : "#4ca9e8";

    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;

    // Lignes latérales
    ctx.beginPath();

    ctx.moveTo(-33, 35);
    ctx.quadraticCurveTo(-38, 72, -19, 108);

    ctx.moveTo(33, 35);
    ctx.quadraticCurveTo(38, 72, 19, 108);

    ctx.stroke();

    ctx.restore();
  }

  drawArms(ctx) {
    this.drawArm(ctx, -1);
    this.drawArm(ctx, 1);
  }

  drawArm(ctx, side) {
    ctx.save();
    ctx.scale(side, 1);

    const phase3 = this.phase === 3;
    const armColor = phase3 ? "#6f2918" : "#163f67";
    const handColor = phase3 ? "#84351e" : "#204f77";
    const plateColor = phase3 ? "#a44724" : "#2d648d";
    const outlineColor = phase3 ? "#bd6038" : "#5a83a3";

    // Bras en deux segments, avec un coude plus net.
    ctx.fillStyle = armColor;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(32, 46);
    ctx.lineTo(51, 57);
    ctx.lineTo(59, 81);
    ctx.lineTo(52, 94);
    ctx.lineTo(69, 113);
    ctx.lineTo(58, 126);
    ctx.lineTo(39, 105);
    ctx.lineTo(38, 82);
    ctx.lineTo(24, 55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Plaques de blindage du bras.
    ctx.fillStyle = plateColor;
    ctx.beginPath();
    ctx.moveTo(33, 51);
    ctx.lineTo(48, 60);
    ctx.lineTo(54, 78);
    ctx.lineTo(40, 73);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(43, 91);
    ctx.lineTo(54, 87);
    ctx.lineTo(65, 111);
    ctx.lineTo(53, 115);
    ctx.closePath();
    ctx.fill();

    // Main anguleuse.
    ctx.fillStyle = handColor;
    ctx.strokeStyle = outlineColor;
    ctx.beginPath();
    ctx.moveTo(54, 112);
    ctx.lineTo(68, 111);
    ctx.lineTo(76, 119);
    ctx.lineTo(69, 132);
    ctx.lineTo(56, 128);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Trois serres recourbées. Elles restent dans l'encombrement de l'ancien bras.
    ctx.fillStyle = "#d6dde3";
    ctx.strokeStyle = "#66717b";
    ctx.lineWidth = 1.2;

    const claws = [
      { x: 67, y: 115, tipX: 89, tipY: 114 },
      { x: 70, y: 121, tipX: 92, tipY: 124 },
      { x: 67, y: 127, tipX: 86, tipY: 136 }
    ];

    for (const claw of claws) {
      ctx.beginPath();
      ctx.moveTo(claw.x, claw.y - 2.5);
      ctx.quadraticCurveTo(claw.tipX - 4, claw.tipY - 6, claw.tipX, claw.tipY);
      ctx.quadraticCurveTo(claw.tipX - 7, claw.tipY + 5, claw.x + 1, claw.y + 3);
      ctx.quadraticCurveTo(claw.x + 4, claw.y, claw.x, claw.y - 2.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
  drawHead(ctx) {
    ctx.save();

    const phase3 = this.phase === 3;
    const gradient = ctx.createLinearGradient(0, -84, 0, 72);
    if (phase3) {
      gradient.addColorStop(0, "#ff9a35");
      gradient.addColorStop(0.5, "#c95719");
      gradient.addColorStop(1, "#69220e");
    } else {
      gradient.addColorStop(0, "#3476a8");
      gradient.addColorStop(0.5, "#245b87");
      gradient.addColorStop(1, "#123b61");
    }

    ctx.fillStyle = gradient;
    ctx.strokeStyle = phase3 ? "#e28a51" : "#84a9c3";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";

    // Crâne bas et reptilien, joues resserrées et museau projeté.
    ctx.beginPath();
    ctx.moveTo(0, -84);
    ctx.quadraticCurveTo(-15, -72, -28, -68);
    ctx.quadraticCurveTo(-45, -66, -55, -43);
    ctx.quadraticCurveTo(-58, -23, -49, -5);
    ctx.quadraticCurveTo(-45, 10, -35, 22);
    ctx.quadraticCurveTo(-30, 34, -25, 45);
    ctx.quadraticCurveTo(-20, 59, -11, 68);
    ctx.quadraticCurveTo(0, 74, 11, 68);
    ctx.quadraticCurveTo(20, 59, 25, 45);
    ctx.quadraticCurveTo(30, 34, 35, 22);
    ctx.quadraticCurveTo(45, 10, 49, -5);
    ctx.quadraticCurveTo(58, -23, 55, -43);
    ctx.quadraticCurveTo(45, -66, 28, -68);
    ctx.quadraticCurveTo(15, -72, 0, -84);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    this.drawFacePlates(ctx);
    this.drawHorns(ctx);
    this.drawEyes(ctx);
    this.drawNostrils(ctx);
    this.drawMouth(ctx);
    ctx.restore();
  }

  drawFacePlates(ctx) {
    const phase3 = this.phase === 3;
    const light = phase3 ? "#ffad62" : "#5599ca";
    const medium = phase3 ? "#d66a2d" : "#3979ad";
    const dark = phase3 ? "#873314" : "#163f69";
    const deepest = phase3 ? "#57200f" : "#0b2948";
    const accent = phase3 ? "#ffbc75" : "#79c6f0";

    // Crête étroite dans l'axe du museau.
    ctx.fillStyle = medium;
    ctx.beginPath();
    ctx.moveTo(0, -80);
    ctx.lineTo(-13, -55);
    ctx.quadraticCurveTo(-9, -37, 0, -23);
    ctx.quadraticCurveTo(9, -37, 13, -55);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(0, -78);
    ctx.lineTo(-11, -55);
    ctx.quadraticCurveTo(-6, -43, 0, -35);
    ctx.closePath();
    ctx.fill();

    // Arête dorsale du long museau.
    ctx.fillStyle = medium;
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.quadraticCurveTo(-13, -3, -12, 24);
    ctx.quadraticCurveTo(-11, 43, 0, 56);
    ctx.quadraticCurveTo(11, 43, 12, 24);
    ctx.quadraticCurveTo(13, -3, 0, -25);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.quadraticCurveTo(11, -2, 10, 23);
    ctx.quadraticCurveTo(9, 42, 0, 54);
    ctx.closePath();
    ctx.fill();

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);

      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(50, -43);
      ctx.quadraticCurveTo(35, -50, 17, -38);
      ctx.lineTo(12, -22);
      ctx.quadraticCurveTo(33, -29, 50, -20);
      ctx.closePath();
      ctx.fill();

      // Arcade courbe : elle encadre l'œil sans évoquer un sourcil humain.
      ctx.fillStyle = deepest;
      ctx.beginPath();
      ctx.moveTo(47, -29);
      ctx.quadraticCurveTo(30, -24, 14, -16);
      ctx.quadraticCurveTo(26, -21, 43, -13);
      ctx.quadraticCurveTo(49, -20, 47, -29);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(45, 2);
      ctx.quadraticCurveTo(32, 12, 19, 17);
      ctx.quadraticCurveTo(20, 34, 24, 47);
      ctx.quadraticCurveTo(34, 34, 40, 22);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = medium;
      ctx.beginPath();
      ctx.moveTo(43, 4);
      ctx.quadraticCurveTo(31, 12, 20, 17);
      ctx.quadraticCurveTo(25, 24, 28, 30);
      ctx.quadraticCurveTo(36, 20, 43, 4);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(44, -40);
      ctx.quadraticCurveTo(29, -43, 19, -34);
      ctx.moveTo(40, 7);
      ctx.quadraticCurveTo(29, 14, 25, 25);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawHorns(ctx) {
    const phase3 = this.phase === 3;
    const hornGradient = ctx.createLinearGradient(0, -55, 0, -105);
    hornGradient.addColorStop(0, phase3 ? "#c58a68" : "#9eabb5");
    hornGradient.addColorStop(1, "#edf1f3");

    ctx.fillStyle = hornGradient;
    ctx.strokeStyle = "#63717d";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);

      // Base blindée, corne reculée puis pointe relevée.
      ctx.beginPath();
      ctx.moveTo(35, -67);
      ctx.lineTo(56, -45);
      ctx.quadraticCurveTo(76, -67, 88, -101);
      ctx.quadraticCurveTo(88, -82, 78, -62);
      ctx.quadraticCurveTo(65, -48, 48, -38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Deux stries simples renforcent le volume sans ombre portée.
      ctx.strokeStyle = phase3 ? "#9d5f43" : "#87949f";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(60, -55);
      ctx.lineTo(67, -65);
      ctx.moveTo(72, -69);
      ctx.lineTo(78, -80);
      ctx.stroke();

      ctx.restore();
    }
  }
  drawEyes(ctx) {
    ctx.save();

    const phase3 = this.phase === 3;
    const eyeColor = phase3 ? "#ffcc33" : "#ff3038";
    const eyeDark = phase3 ? "#b83d12" : "#8b102a";
    const glow = Math.max(0, Math.min(1, Number(this.eyeGlow) || 0));

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.translate(28, -9);
      ctx.rotate(-0.24);

      ctx.fillStyle = "#090b13";
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.82 + glow * 0.18;
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.ellipse(-1, 0, 15, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = eyeDark;
      ctx.beginPath();
      ctx.ellipse(5, 1, 7, 5.2, 0, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      // Pupille verticale fendue.
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#050207";
      ctx.beginPath();
      ctx.moveTo(-1, -6);
      ctx.quadraticCurveTo(2, 0, -1, 6);
      ctx.quadraticCurveTo(-4, 0, -1, -6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
      ctx.beginPath();
      ctx.ellipse(-7, -2.5, 3, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
  drawNostrils(ctx) {
    ctx.fillStyle = "#071a29";
    ctx.beginPath();
    ctx.ellipse(-6, 37, 2.5, 4, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, 37, 2.5, 4, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  drawMouth(ctx) {
    const opening = this.mouthOpen;
    const upperY = 51;
    const lowerY = 54 + opening * 18;

    ctx.fillStyle = "#14070a";
    ctx.strokeStyle = "#091824";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, upperY);
    ctx.quadraticCurveTo(0, lowerY + 5, 18, upperY);
    ctx.quadraticCurveTo(0, upperY + 4, -18, upperY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (opening < 0.18) return;

    ctx.fillStyle = "#eee8dc";
    const teeth = [-13, -6.5, 0, 6.5, 13];
    for (const toothX of teeth) {
      ctx.beginPath();
      ctx.moveTo(toothX - 2.2, upperY);
      ctx.lineTo(toothX + 2.2, upperY);
      ctx.lineTo(toothX, upperY + 7);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(toothX - 2.2, lowerY);
      ctx.lineTo(toothX + 2.2, lowerY);
      ctx.lineTo(toothX, lowerY - 7);
      ctx.closePath();
      ctx.fill();
    }
  }
}