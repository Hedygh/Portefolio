const grid = document.getElementById("gamesGrid");

const GAME_UI = {
  "Dodge Runner": {
    slug: "dodge-runner",
    preview: "../assets/RecordGame1.mp4",
    available: true,
    page: "game-dodge-runner.html"
  },
  "Platformer Escape": {
    slug: "platformer-escape",
    preview: "../assets/RecordGame2.mp4",
    available: true,
    page: "game-platformer-escape.html"
  },
  "Speed Click Challenge": {
    slug: "speed-click-challenge",
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
          ${
            ui.preview
              ? `<video class="game-card__preview" muted loop playsinline preload="metadata">
                   <source src="${ui.preview}" type="video/mp4">
                 </video>`
              : `<span class="game-card__icon">⚡</span>`
          }
</div>
        <div class="game-card__body">
          <h2 class="game-card__name">${game.name}</h2>
          <p class="game-card__desc">${game.description || "Beat the score and climb the leaderboard."}</p>
          <div class="game-card__actions">
            ${
              ui.available
                ? `<a class="game-card__btn game-card__btn--play" href="${ui.page}?game=${ui.slug}">PLAY</a>`
                : `<span class="game-card__btn game-card__btn--board">COMING SOON</span>`
            }
            <a class="game-card__btn game-card__btn--board" href="leaderboard.html?game=${ui.slug}">LEADERBOARD</a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
    document.querySelectorAll(".game-card__preview").forEach((video) => {

        video.addEventListener("mouseenter", () => {
            video.play();
        });

        video.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
        });

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