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
    this.segmentCount = 42;
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

    this.health = 260;
    this.maxHealth = 260;

    this.state = "entering";

    this.path = [];
    this.segments = [];

    this.targetTimer = 0;

    this.initializePath();
  }

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
      this.speed = 1.7;
    } else if (healthRatio > 0.33) {
      this.speed = 2.3;
    } else {
      this.speed = 3;
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

    this.targetTimer =
      180 + Math.floor(Math.random() * 180);
  }

  moveHead() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
      return;
    }

    this.x += (dx / distance) * this.speed;
    this.y += (dy / distance) * this.speed;
  }

  updatePath() {
    this.path.unshift({
      x: this.x,
      y: this.y
    });

    const maxPathLength =
      this.segmentCount * this.segmentSpacing + 1;

    if (this.path.length > maxPathLength) {
      this.path.length = maxPathLength;
    }
  }

  updateSegments() {
    this.segments = [];

    for (let i = 0; i < this.segmentCount; i++) {
      const pathIndex = Math.min(
        i * this.segmentSpacing,
        this.path.length - 1
      );

      const position = this.path[pathIndex];

      this.segments.push({
        x: position.x,
        y: position.y,
        radius: this.getSegmentRadius(i),
        index: i
      });
    }
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