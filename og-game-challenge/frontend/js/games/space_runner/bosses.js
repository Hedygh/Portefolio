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

    this.health = 170;
    this.maxHealth = 170;

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

    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    const r = this.width / 2;

    ctx.fillStyle = "#3a003f";
    ctx.strokeStyle = "#ff3355";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#8a2be2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f2f2f2";
    ctx.beginPath();
    ctx.ellipse(0, -5, r * 0.55, r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff3333";
    ctx.beginPath();
    ctx.arc(0, -5, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(0, -5, r * 0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ff6688";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.2);
    ctx.lineTo(-r * 0.2, -r * 0.05);
    ctx.lineTo(-r * 0.45, r * 0.15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(r * 0.5, -r * 0.15);
    ctx.lineTo(r * 0.2, -r * 0.02);
    ctx.lineTo(r * 0.45, r * 0.2);
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

    this.health = 600;
    this.maxHealth = 600;

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

    ctx.fillStyle =
      segment.index % 3 === 0
        ? "#62546f"
        : "#68635f";

    ctx.strokeStyle = "#29252d";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      segment.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    if (segment.index % 4 === 0) {
      ctx.fillStyle =
        segment.index % 8 === 0
          ? "#c6652b"
          : "#713f86";

      ctx.beginPath();
      ctx.ellipse(
        -segment.radius * 0.15,
        segment.radius * 0.1,
        segment.radius * 0.42,
        segment.radius * 0.25,
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

    ctx.fillStyle = "#706b66";
    ctx.strokeStyle = "#29252d";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, this.headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#180d12";

    ctx.beginPath();
    ctx.ellipse(
      this.headRadius * 0.35,
      0,
      this.headRadius * 0.55,
      this.headRadius * 0.68,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    this.drawTeeth(ctx);

    ctx.restore();
  }

  drawTeeth(ctx) {
    ctx.fillStyle = "#f0eadc";

    const toothCount = 8;

    for (let i = 0; i < toothCount; i++) {
      const offset =
        -18 + i * (36 / (toothCount - 1));

      ctx.beginPath();
      ctx.moveTo(16, offset - 2);
      ctx.lineTo(29, offset);
      ctx.lineTo(16, offset + 3);
      ctx.closePath();
      ctx.fill();
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

    ctx.fillStyle = "#f2eee3";
    ctx.strokeStyle = "#777";
    ctx.lineWidth = 1;

    const hornAngles = [-0.55, 0, 0.55];

    for (const hornAngle of hornAngles) {
      ctx.save();
      ctx.rotate(hornAngle);

      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.lineTo(-34, 0);
      ctx.lineTo(-5, 5);
      ctx.closePath();

      ctx.fill();
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

    this.active = true;

    this.health = 700;
    this.maxHealth = 700;
    this.attackTimer = 110;
    this.state = "entering";
    this.phase = 1;

    this.animationFrame = 0;

    this.wingAngle = 0;
    this.mouthOpen = 0;
    this.eyeGlow = 0;

    this.mouthTimer = 120;
    this.mouthState = "closed";
  }

  update() {
    this.animationFrame++;

    this.updateWings();
    this.updateEyes();
    this.updateMouth();

    if (this.state === "entering") {
      this.updateEntering();
      return;
    }

    if (this.state === "fighting") {
      this.updateHorizontalMovement();

      if (this.attackTimer > 0) {
        this.attackTimer--;
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

    if (this.x <= leftLimit) {
      this.x = leftLimit;
      this.direction = 1;
    }

    if (this.x >= rightLimit) {
      this.x = rightLimit;
      this.direction = -1;
    }
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

    /*
    * La rotation est légère :
    * la base reste stable, l'extrémité semble battre.
    */
    ctx.rotate(this.wingAngle * 0.45);

    const gradient = ctx.createLinearGradient(
      35,
      0,
      205,
      -30
    );

    gradient.addColorStop(0, "#174a78");
    gradient.addColorStop(0.45, "#0d3158");
    gradient.addColorStop(1, "#071a33");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#568dbd";
    ctx.lineWidth = 3;

    ctx.beginPath();

    // Base supérieure, très large près du corps.
    ctx.moveTo(38, -25);

    ctx.quadraticCurveTo(
      78,
      -77,
      134,
      -83
    );

    // Long bord supérieur qui s'affine.
    ctx.quadraticCurveTo(
      177,
      -87,
      207,
      -64
    );

    // Pointe extérieure crochue.
    ctx.quadraticCurveTo(
      220,
      -49,
      207,
      -25
    );

    ctx.quadraticCurveTo(
      201,
      -9,
      190,
      5
    );

    // Bas de l'aile : plusieurs creux.
    ctx.quadraticCurveTo(
      180,
      25,
      169,
      38
    );

    ctx.quadraticCurveTo(
      157,
      15,
      143,
      10
    );

    ctx.quadraticCurveTo(
      135,
      39,
      119,
      54
    );

    ctx.quadraticCurveTo(
      105,
      24,
      90,
      17
    );

    ctx.quadraticCurveTo(
      79,
      50,
      60,
      62
    );

    // Retour vers l'épaule.
    ctx.quadraticCurveTo(
      49,
      27,
      38,
      -25
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Os supérieur principal.
    ctx.strokeStyle = "#326895";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(40, -23);

    ctx.quadraticCurveTo(
      99,
      -74,
      204,
      -62
    );

    ctx.stroke();

    // Nervures de la membrane.
    ctx.strokeStyle = "#244f76";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(48, -18);
    ctx.quadraticCurveTo(100, -35, 168, 36);

    ctx.moveTo(50, -13);
    ctx.quadraticCurveTo(88, -6, 119, 52);

    ctx.moveTo(52, -8);
    ctx.quadraticCurveTo(70, 15, 61, 58);

    ctx.stroke();

    // Petite griffe à l'extrémité.
    ctx.fillStyle = "#c7d2dc";
    ctx.strokeStyle = "#667582";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(202, -62);
    ctx.lineTo(224, -77);
    ctx.lineTo(211, -53);
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
  }

  drawArms(ctx) {
    this.drawArm(ctx, -1);
    this.drawArm(ctx, 1);
  }

  drawArm(ctx, side) {
    ctx.save();
    ctx.scale(side, 1);

    ctx.fillStyle = "#163f67";
    ctx.strokeStyle = "#5a83a3";
    ctx.lineWidth = 2.5;

    ctx.beginPath();

    ctx.moveTo(34, 48);

    ctx.quadraticCurveTo(
      54,
      64,
      55,
      88
    );

    ctx.quadraticCurveTo(
      54,
      107,
      68,
      119
    );

    ctx.lineTo(57, 127);

    ctx.quadraticCurveTo(
      36,
      114,
      39,
      87
    );

    ctx.quadraticCurveTo(
      39,
      67,
      25,
      54
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main.
    ctx.fillStyle = "#204f77";

    ctx.beginPath();
    ctx.ellipse(
      62,
      121,
      13,
      9,
      0.35,
      0,
      Math.PI * 2
    );

    ctx.fill();
    ctx.stroke();

    // Griffes.
    ctx.fillStyle = "#d6dde3";
    ctx.strokeStyle = "#66717b";
    ctx.lineWidth = 1;

    for (let i = 0; i < 3; i++) {
      const clawY = 115 + i * 6;

      ctx.beginPath();
      ctx.moveTo(65, clawY);
      ctx.lineTo(84 + i * 3, clawY + 5);
      ctx.lineTo(66, clawY + 8);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
  drawHead(ctx) {
    ctx.save();

    const gradient = ctx.createLinearGradient(
      0,
      -82,
      0,
      65
    );

    gradient.addColorStop(0, "#3476a8");
    gradient.addColorStop(0.5, "#245b87");
    gradient.addColorStop(1, "#123b61");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#84a9c3";
    ctx.lineWidth = 3;

    ctx.beginPath();

    /*
    * Deux pointes supérieures du crâne.
    * Elles servent aussi de bases aux cornes.
    */
    ctx.moveTo(-56, -43);
    ctx.lineTo(-31, -69);

    // Sommet central.
    ctx.lineTo(0, -82);

    ctx.lineTo(31, -69);
    ctx.lineTo(56, -43);

    // Tempes.
    ctx.lineTo(48, -3);
    ctx.lineTo(35, 26);

    // Le museau se resserre fortement.
    ctx.lineTo(21, 52);
    ctx.lineTo(0, 70);
    ctx.lineTo(-21, 52);
    ctx.lineTo(-35, 26);
    ctx.lineTo(-48, -3);

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
    ctx.fillStyle = "#4381ad";

    // Crête centrale.
    ctx.beginPath();
    ctx.moveTo(0, -72);
    ctx.lineTo(-14, -43);
    ctx.lineTo(0, -25);
    ctx.lineTo(14, -43);
    ctx.closePath();
    ctx.fill();

    // Plaque centrale.
    ctx.fillStyle = "#39739d";

    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(-12, 3);
    ctx.lineTo(0, 24);
    ctx.lineTo(12, 3);
    ctx.closePath();
    ctx.fill();

    // Joues.
    ctx.fillStyle = "#1b4d77";

    ctx.beginPath();
    ctx.moveTo(-44, 4);
    ctx.lineTo(-18, 15);
    ctx.lineTo(-25, 39);
    ctx.lineTo(-39, 24);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(44, 4);
    ctx.lineTo(18, 15);
    ctx.lineTo(25, 39);
    ctx.lineTo(39, 24);
    ctx.closePath();
    ctx.fill();
  }
  drawHorns(ctx) {
    ctx.fillStyle = "#d4dce3";
    ctx.strokeStyle = "#63717d";
    ctx.lineWidth = 2;

    // Corne gauche : attachée à la pointe gauche du crâne.
    ctx.beginPath();

    ctx.moveTo(-54, -42);

    ctx.quadraticCurveTo(
      -80,
      -68,
      -88,
      -99
    );

    ctx.quadraticCurveTo(
      -64,
      -76,
      -31,
      -66
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Corne droite.
    ctx.beginPath();

    ctx.moveTo(54, -42);

    ctx.quadraticCurveTo(
      80,
      -68,
      88,
      -99
    );

    ctx.quadraticCurveTo(
      64,
      -76,
      31,
      -66
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  drawEyes(ctx) {
    ctx.save();

    ctx.shadowColor = "#ff2020";
    ctx.shadowBlur = 6 * this.eyeGlow;

    ctx.fillStyle = "#ff2424";

    // Œil gauche.
    ctx.beginPath();
    ctx.moveTo(-39, -18);
    ctx.lineTo(-11, -10);
    ctx.lineTo(-20, 4);
    ctx.lineTo(-42, -5);
    ctx.closePath();
    ctx.fill();

    // Œil droit.
    ctx.beginPath();
    ctx.moveTo(39, -18);
    ctx.lineTo(11, -10);
    ctx.lineTo(20, 4);
    ctx.lineTo(42, -5);
    ctx.closePath();
    ctx.fill();

    // Pupilles verticales.
    ctx.fillStyle = "#190000";

    ctx.beginPath();
    ctx.ellipse(
      -26,
      -7,
      2.5,
      8,
      -0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
      26,
      -7,
      2.5,
      8,
      0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
  drawNostrils(ctx) {
    ctx.fillStyle = "#071a29";

    ctx.beginPath();
    ctx.ellipse(
      -7,
      30,
      3,
      4,
      -0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
      7,
      30,
      3,
      4,
      0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  drawMouth(ctx) {
    const opening = this.mouthOpen;
    const upperY = 44;
    const lowerY = 47 + opening * 18;

    ctx.fillStyle = "#14070a";
    ctx.strokeStyle = "#091824";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(-21, upperY);

    ctx.quadraticCurveTo(
      0,
      lowerY + 5,
      21,
      upperY
    );

    ctx.quadraticCurveTo(
      0,
      upperY + 5,
      -21,
      upperY
    );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (opening < 0.18) {
      return;
    }

    ctx.fillStyle = "#eee8dc";

    const teeth = [-16, -8, 0, 8, 16];

    for (const toothX of teeth) {
      ctx.beginPath();
      ctx.moveTo(toothX - 2.5, upperY);
      ctx.lineTo(toothX + 2.5, upperY);
      ctx.lineTo(toothX, upperY + 7);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(toothX - 2.5, lowerY);
      ctx.lineTo(toothX + 2.5, lowerY);
      ctx.lineTo(toothX, lowerY - 7);
      ctx.closePath();
      ctx.fill();
    }
  }
}