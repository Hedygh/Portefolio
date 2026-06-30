# Script complet + explication simple

Ce fichier sert de fiche de revision. Le but n'est pas d'apprendre chaque ligne par coeur, mais de comprendre la logique globale pour pouvoir l'expliquer simplement.

## Idee generale

Les deux jeux marchent presque pareil :

1. On prepare le joueur, les obstacles et le score.
2. On lance une boucle avec `requestAnimationFrame`.
3. A chaque tour de boucle, on met a jour le jeu avec `updateGame()`.
4. Ensuite on redessine le canvas avec `drawGame()`.
5. Si le joueur perd, on arrete la boucle et on appelle `submitScore(...)`.

La difficulte reste simple : plus le temps passe, plus la vitesse augmente et plus les obstacles arrivent souvent.

---

## `static/js/score.js`

```js
(function () {
  "use strict";

  window.lastGameScore = null;

  window.submitScore = function submitScore(gameName, score) {
    var payload = {
      gameName: gameName,
      score: score,
      createdAt: new Date().toISOString()
    };

    window.lastGameScore = payload;
    console.log("Game:", payload.gameName);
    console.log("Score:", payload.score);
    window.dispatchEvent(new CustomEvent("game-score", { detail: payload }));
  };
})();
```

### A retenir

`submitScore()` est une fonction temporaire. Pour l'instant elle affiche le score dans la console. Plus tard, elle pourra envoyer le score a Flask avec un `fetch()`.

---

## `static/js/games/dodge_runner.js`

```js
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
      window.submitScore(GAME_NAME, score);
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
```

### A retenir pour Dodge Runner

Le joueur est un rectangle vert. Les obstacles sont des rectangles blancs qui tombent.

La fonction la plus importante est `updateGame()` :

- elle calcule le temps passe avec `elapsed` ;
- elle augmente le score ;
- elle lit les touches gauche/droite ;
- elle deplace le joueur ;
- elle ajoute des obstacles ;
- elle fait tomber les obstacles ;
- elle verifie les collisions.

La difficulte est simple :

```js
spawnTimer = Math.max(0.35, 0.85 - elapsed * 0.01);
speed: randomRange(160, 230) + elapsed * 6
```

Donc avec le temps, les obstacles arrivent plus souvent et tombent plus vite.

---

## `static/js/games/platformer_escape.js`

```js
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
      window.submitScore(GAME_NAME, score);
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
```

### A retenir pour Platformer Escape

Le joueur ne bouge pas vers la droite. C'est le decor qui vient vers lui. C'est plus simple a coder.

Le saut fonctionne avec deux valeurs :

```js
var gravity = 1500;
var jumpPower = -620;
```

Quand on saute, `player.vy` devient negatif, donc le joueur monte. Ensuite la gravite rajoute de la vitesse vers le bas, donc il retombe.

Les trous et obstacles sont dans le meme tableau :

```js
var hazards = [];
```

Chaque element a un `type` :

- `gap` pour un trou ;
- `obstacle` pour un bloc.

La difficulte est simple :

```js
var speed = 230 + elapsed * 6;
spawnTimer = Math.max(0.75, 1.25 - elapsed * 0.01);
```

Donc le decor avance plus vite et les dangers arrivent plus souvent.

---

## `templates/play.html`

Ce fichier relie tout :

- il charge le CSS ;
- il affiche le canvas ;
- il affiche les boutons Start/Stop ;
- il charge `score.js`, puis les deux jeux ;
- il choisit quel jeu demarrer.

La partie la plus importante :

```js
function buildGame(gameId) {
  var options = {
    canvas: canvas,
    scoreElement: scoreElement,
    messageElement: messageElement
  };

  if (gameId === "platformer") {
    return window.createPlatformerEscape(options);
  }

  return window.createDodgeRunner(options);
}
```

Ca veut dire : si on clique sur Platformer, on cree le jeu Platformer. Sinon, on cree Dodge Runner.

---

## Ce que tu peux dire si on te demande d'expliquer

Tu peux dire un truc comme ca :

> J'ai fait deux mini-jeux en JavaScript avec canvas. Les deux ont la meme logique : une fonction pour demarrer, une boucle de jeu avec requestAnimationFrame, une fonction update pour calculer les mouvements et collisions, et une fonction draw pour afficher. A la fin, le jeu appelle submitScore avec le nom du jeu et le score. Pour la difficulte, j'utilise le temps ecoule : plus la partie dure, plus les obstacles vont vite et plus ils apparaissent souvent.

Pour Dodge Runner :

> Le joueur bouge a gauche et a droite. Les obstacles tombent. Si un rectangle touche le joueur, c'est perdu. Le score correspond au temps de survie.

Pour Platformer :

> Le joueur saute avec espace. Il y a une gravite simple avec une vitesse verticale. Le decor avance vers le joueur. S'il touche un obstacle ou tombe dans un trou, c'est perdu. Le score correspond a la distance parcourue.

---

## Les mots importants a connaitre

- `canvas` : zone ou on dessine le jeu.
- `ctx` : outil qui permet de dessiner dans le canvas.
- `requestAnimationFrame` : lance la boucle du jeu de maniere fluide.
- `dt` : temps entre deux images, utile pour que les mouvements restent propres.
- `elapsed` : temps ecoule depuis le debut de la partie.
- `score` : score actuel.
- `gameOver` : dit si la partie est terminee.
- `collision` : quand deux rectangles se touchent.
- `submitScore()` : fonction qui recupere le score final.
