(function () {
  "use strict";

  var GAME_NAME = "dodge_runner";

  function createDodgeRunner(options) {
    var canvas = options.canvas;
    var ctx = canvas.getContext("2d");
    var scoreElement = options.scoreElement;
    var messageElement = options.messageElement;

    var width = canvas.width;
    var height = canvas.height;
    var keys = {};
    var player;
    var obstacles = [];
    var score = 0;
    var level = 1;
    var startTime = 0;
    var lastTime = 0;
    var spawnTimer = 0;
    var running = false;
    var gameOver = false;
    var frameId = null;

    function startGame() {
      stopGame(false);

      player = {
        x: width / 2 - 20,
        y: height - 45,
        w: 40,
        h: 18,
        speed: 360
      };

      obstacles = [];
      score = 0;
      level = 1;
      spawnTimer = 0.8;
      gameOver = false;
      running = true;
      startTime = performance.now();
      lastTime = startTime;
      messageElement.textContent = "Dodge Runner";
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
      var direction = 0;

      level = 1 + Math.floor(elapsed / 12);
      score = Math.floor(elapsed * 10);

      if (keys.ArrowLeft || keys.a) {
        direction -= 1;
      }
      if (keys.ArrowRight || keys.d) {
        direction += 1;
      }

      player.x += direction * player.speed * dt;
      player.x = clamp(player.x, 0, width - player.w);

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        addObstacle(elapsed);
        spawnTimer = Math.max(0.35, 0.85 - elapsed * 0.01);
      }

      moveObstacles(dt, elapsed);
      checkCollisions();
      updateScore();
    }

    function addObstacle(elapsed) {
      var obstacleWidth = randomRange(24, 56);

      obstacles.push({
        x: randomRange(0, width - obstacleWidth),
        y: -40,
        w: obstacleWidth,
        h: randomRange(22, 46),
        speed: randomRange(160, 230) + elapsed * 6
      });
    }

    function moveObstacles(dt) {
      for (var i = obstacles.length - 1; i >= 0; i -= 1) {
        obstacles[i].y += obstacles[i].speed * dt;

        if (obstacles[i].y > height + 50) {
          obstacles.splice(i, 1);
        }
      }
    }

    function checkCollisions() {
      for (var i = 0; i < obstacles.length; i += 1) {
        if (rectsTouch(player, obstacles[i])) {
          endGame();
          return;
        }
      }
    }

    function drawGame() {
      drawBackground();

      ctx.fillStyle = "#00ff66";
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(player.x, player.y, player.w, player.h);

      ctx.fillStyle = "#ffffff";
      for (var i = 0; i < obstacles.length; i += 1) {
        var obstacle = obstacles[i];
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
      }

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
      ctx.lineWidth = 1;

      for (var x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (var y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
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
      var key = normalizeKey(event.key);

      if (key === "ArrowLeft" || key === "ArrowRight" || key === "a" || key === "d") {
        keys[key] = true;
        event.preventDefault();
      }
    }

    function handleKeyUp(event) {
      var key = normalizeKey(event.key);

      if (key === "ArrowLeft" || key === "ArrowRight" || key === "a" || key === "d") {
        keys[key] = false;
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    drawBackground();
    messageElement.textContent = "Pret";

    return {
      name: GAME_NAME,
      start: startGame,
      stop: stopGame,
      destroy: function destroy() {
        stopGame(false);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function normalizeKey(key) {
    return key.length === 1 ? key.toLowerCase() : key;
  }

  window.createDodgeRunner = createDodgeRunner;
})();
