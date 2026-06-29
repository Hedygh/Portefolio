(function () {
  "use strict";

  var GAME_NAME = "platformer_escape";

  function createPlatformerEscape(options) {
    var canvas = options.canvas;
    var ctx = canvas.getContext("2d");
    var scoreElement = options.scoreElement;
    var messageElement = options.messageElement;

    var width = canvas.width;
    var height = canvas.height;
    var groundY = height - 58;
    var gravity = 1500;
    var jumpPower = -620;
    var player;
    var hazards = [];
    var score = 0;
    var level = 1;
    var distance = 0;
    var startTime = 0;
    var lastTime = 0;
    var spawnTimer = 0;
    var running = false;
    var gameOver = false;
    var frameId = null;

    function startGame() {
      stopGame(false);

      player = {
        x: 95,
        y: groundY - 42,
        w: 30,
        h: 42,
        vy: 0,
        onGround: true
      };

      hazards = [];
      score = 0;
      level = 1;
      distance = 0;
      spawnTimer = 1.2;
      gameOver = false;
      running = true;
      startTime = performance.now();
      lastTime = startTime;
      messageElement.textContent = "Platformer Escape";
      updateScore();

      frameId = requestAnimationFrame(gameLoop);
    }

    function stopGame(resetMessage) {
      running = false;
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (resetMessage) {
        messageElement.textContent = "Pret";
      }
    }

    function gameLoop(now) {
      if (!running || gameOver) {
        return;
      }

      var dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      updateGame(dt, now);
      drawGame();

      frameId = requestAnimationFrame(gameLoop);
    }

    function updateGame(dt, now) {
      var elapsed = (now - startTime) / 1000;
      var speed = 230 + elapsed * 6;

      level = 1 + Math.floor(elapsed / 12);
      distance += speed * dt;
      score = Math.floor(distance / 12);

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        addHazard(elapsed);
        spawnTimer = Math.max(0.75, 1.25 - elapsed * 0.01);
      }

      moveHazards(dt, speed);
      updatePlayer(dt);
      checkCollisions();
      updateScore();
    }

    function addHazard(elapsed) {
      var makeGap = Math.random() < 0.35;

      if (makeGap) {
        hazards.push({
          type: "gap",
          x: width + 20,
          w: randomRange(65, 105 + elapsed)
        });
      } else {
        var obstacleHeight = randomRange(28, 55);

        hazards.push({
          type: "obstacle",
          x: width + 20,
          y: groundY - obstacleHeight,
          w: 28,
          h: obstacleHeight
        });
      }
    }

    function moveHazards(dt, speed) {
      for (var i = hazards.length - 1; i >= 0; i -= 1) {
        hazards[i].x -= speed * dt;

        if (hazards[i].x + hazards[i].w < -50) {
          hazards.splice(i, 1);
        }
      }
    }

    function updatePlayer(dt) {
      player.vy += gravity * dt;
      player.y += player.vy * dt;

      if (!isAboveGap() && player.y + player.h >= groundY) {
        player.y = groundY - player.h;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.onGround = false;
      }

      if (player.y > height + 50) {
        endGame();
      }
    }

    function jump() {
      if (running && player.onGround && !gameOver) {
        player.vy = jumpPower;
        player.onGround = false;
      }
    }

    function isAboveGap() {
      var playerMiddle = player.x + player.w / 2;

      for (var i = 0; i < hazards.length; i += 1) {
        var hazard = hazards[i];

        if (hazard.type === "gap" && playerMiddle > hazard.x && playerMiddle < hazard.x + hazard.w) {
          return true;
        }
      }

      return false;
    }

    function checkCollisions() {
      for (var i = 0; i < hazards.length; i += 1) {
        var hazard = hazards[i];

        if (hazard.type === "obstacle" && rectsTouch(player, hazard)) {
          endGame();
          return;
        }
      }
    }

    function drawGame() {
      drawBackground();
      drawGround();

      for (var i = 0; i < hazards.length; i += 1) {
        drawHazard(hazards[i]);
      }

      drawPlayer();

      ctx.fillStyle = "#00ff66";
      ctx.font = "18px monospace";
      ctx.fillText("Score: " + score, 16, 28);
      ctx.fillText("Level: " + level, 16, 52);
    }

    function drawBackground() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 255, 102, 0.15)";
      for (var x = 0; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    function drawGround() {
      ctx.fillStyle = "#00ff66";
      ctx.fillRect(0, groundY, width, 4);

      for (var i = 0; i < hazards.length; i += 1) {
        var hazard = hazards[i];

        if (hazard.type === "gap") {
          ctx.fillStyle = "#000000";
          ctx.fillRect(hazard.x, groundY - 3, hazard.w, 12);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(hazard.x - 2, groundY - 12, 2, 16);
          ctx.fillRect(hazard.x + hazard.w, groundY - 12, 2, 16);
        }
      }
    }

    function drawHazard(hazard) {
      if (hazard.type !== "obstacle") {
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
      ctx.strokeStyle = "#00ff66";
      ctx.strokeRect(hazard.x, hazard.y, hazard.w, hazard.h);
    }

    function drawPlayer() {
      var middleX = player.x + player.w / 2;
      var headY = player.y + 8;
      var bodyTop = player.y + 18;
      var bodyBottom = player.y + 32;
      var footY = player.y + player.h;
      var legMove = player.onGround ? Math.sin(distance / 18) * 6 : 0;

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#00ff66";
      ctx.fillStyle = "#000000";

      ctx.beginPath();
      ctx.arc(middleX, headY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(middleX, bodyTop);
      ctx.lineTo(middleX, bodyBottom);
      ctx.stroke();

      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(middleX, bodyTop + 4);
      ctx.lineTo(middleX - 10, bodyTop + 12);
      ctx.moveTo(middleX, bodyTop + 4);
      ctx.lineTo(middleX + 10, bodyTop + 12);
      ctx.stroke();

      ctx.strokeStyle = "#00ff66";
      ctx.beginPath();
      ctx.moveTo(middleX, bodyBottom);
      ctx.lineTo(middleX - 8, footY + legMove);
      ctx.moveTo(middleX, bodyBottom);
      ctx.lineTo(middleX + 8, footY - legMove);
      ctx.stroke();
    }

    function endGame() {
      if (gameOver) {
        return;
      }

      gameOver = true;
      running = false;
      messageElement.textContent = "Game Over";
      window.handleGameOver(GAME_NAME, score);
    }

    function updateScore() {
      scoreElement.textContent = score + " / LVL " + level;
    }

    function handleKeyDown(event) {
      if (event.key === " " || event.key === "ArrowUp" || event.key === "Spacebar") {
        event.preventDefault();
        jump();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    drawBackground();
    drawGround();
    messageElement.textContent = "Pret";

    return {
      name: GAME_NAME,
      start: startGame,
      stop: stopGame,
      destroy: function destroy() {
        stopGame(false);
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }

  function rectsTouch(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  window.createPlatformerEscape = createPlatformerEscape;
})();
