// ═══════════════════════════════════════
// SCORE ADAPTER — Connect games to backend
// ═══════════════════════════════════════

async function handleGameOver(gameKey, value) {
  const user = getCurrentUser();

  if (!user) {
    showGameOverOverlay({
      title: "REGISTER REQUIRED",
      score: value,
      message: "Create a player profile before submitting a score.",
      gameId: null
    });
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("game");

  if (!gameId) {
    console.error("Missing game id in URL.");
    return;
  }

  try {
  const savedScore = await submitScore(user.id, gameId, value);
  const bestScore = savedScore.value;
  const isNewBest = value >= bestScore;

  console.log("Score submitted:", {
    game: gameKey,
    user: user.username,
    currentScore: value,
    bestScore: bestScore
  });

  showGameOverOverlay({
    title: "GAME OVER",
    score: value,
    bestScore: bestScore,
    isNewBest: isNewBest,
    message: isNewBest ? "NEW PERSONAL BEST" : "SCORE SAVED",
    gameId: gameId
  });
} catch (error) {
    console.error(error);

    showGameOverOverlay({
      title: "SCORE ERROR",
      score: value,
      message: "Score could not be submitted.",
      gameId: gameId
    });
  }
}

function showGameOverOverlay(data) {
  const existingOverlay = document.getElementById("gameOverOverlay");

  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = "gameOverOverlay";
  overlay.className = "game-over-overlay";

 overlay.innerHTML = `
  <div class="game-over-card">
    <h2 class="game-over-title">${data.title}</h2>

    <p class="game-over-label">CURRENT SCORE</p>
    <div class="game-over-score">${data.score}</div>

    ${
      data.bestScore !== undefined
        ? `
          <p class="game-over-label">BEST SCORE</p>
          <div class="game-over-best">${data.bestScore}</div>
        `
        : ""
    }

    <p class="game-over-message">${data.message}</p>

    <div class="game-over-actions">
      <button class="game-card__btn game-card__btn--play" id="retryButton">
        PLAY AGAIN
      </button>

      ${
        data.gameId
          ? `<a class="game-card__btn game-card__btn--board" href="leaderboard.html?game=${data.gameId}">
              LEADERBOARD
            </a>`
          : `<a class="game-card__btn game-card__btn--board" href="register.html">
              REGISTER
            </a>`
      }
    </div>
  </div>
`;

  document.body.appendChild(overlay);

  document.getElementById("retryButton").addEventListener("click", () => {
    window.location.reload();
  });
}

window.handleGameOver = handleGameOver;
