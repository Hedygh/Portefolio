const grid = document.getElementById("gamesGrid");

const GAME_UI = {
  "Dodge Runner": {
    icon: "🏃",
    available: true,
    page: "game-dodge-runner.html"
  },
  "Platformer Escape": {
    icon: "🎮",
    available: true,
    page: "game-platformer-escape.html"
  },
  "Speed Click Challenge": {
    icon: "⚡",
    available: false,
    page: null
  }
};

async function renderGames() {
  try {
    const games = await getGames();

    grid.innerHTML = "";

    games.forEach((game) => {
      const ui = GAME_UI[game.name] || {
        icon: "🎲",
        available: false,
        page: null
      };

      const card = document.createElement("div");
      card.className = "game-card";

      card.innerHTML = `
        <div class="game-card__visual">
          <span class="game-card__icon">${ui.icon}</span>
        </div>
        <div class="game-card__body">
          <h2 class="game-card__name">${game.name}</h2>
          <p class="game-card__desc">${game.description || "Beat the score and climb the leaderboard."}</p>
          <div class="game-card__actions">
            ${
              ui.available
                ? `<a class="game-card__btn game-card__btn--play" href="${ui.page}?game=${game.id}">PLAY</a>`
                : `<span class="game-card__btn game-card__btn--board">COMING SOON</span>`
            }
            <a class="game-card__btn game-card__btn--board" href="leaderboard.html?game=${game.id}">LEADERBOARD</a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <p class="game-card__desc">
        Unable to load games. Please make sure the backend is running.
      </p>
    `;
  }
}

renderGames();