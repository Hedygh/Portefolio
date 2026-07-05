// ═══════════════════════════════════════
// LEADERBOARD — Fetch data from backend
// ═══════════════════════════════════════

const tabsEl = document.getElementById("gameTabs");
const bodyEl = document.getElementById("leaderboardBody");
const playerEl = document.getElementById("playerRank");

const params = new URLSearchParams(window.location.search);
let currentGame = params.get("game");

let games = [];
function makeSlug(name) {
  return name.toLowerCase().replaceAll(" ", "-");
}
async function initLeaderboard() {
  try {
    games = await getGames();
    if (!games.length) {
      bodyEl.innerHTML = "<p>No games available.</p>";
      return;
    }

    if (!currentGame) {
      currentGame = games[0].id;
    }

    renderTabs();
    await renderBoard();
  } catch (error) {
    console.error(error);
    bodyEl.innerHTML = "<p>Unable to load leaderboard.</p>";
  }
}

function renderTabs() {
  tabsEl.innerHTML = "";

  games.forEach((game) => {
    const tab = document.createElement("button");
    tab.className = "tab" + (String(game.id) === String(currentGame) ? " tab--active" : "");
    tab.textContent = game.name;

    tab.addEventListener("click", async () => {
      currentGame = game.id;
      window.history.replaceState(
  null,
  "",
  `leaderboard.html?game=${makeSlug(game.name)}`
);
      renderTabs();
      await renderBoard();
    });

    tabsEl.appendChild(tab);
  });
}

async function renderBoard() {
  try {
    const selectedGame = games.find((game) => makeSlug(game.name) === currentGame);
    const backendGameId = selectedGame ? selectedGame.id : currentGame;
    const leaderboard = await getLeaderboard(backendGameId);
    const user = getCurrentUser();

    const playerEntry = user
      ? leaderboard.find((entry) => entry.user_id === user.id)
      : null;

    bodyEl.innerHTML = "";

    if (!leaderboard.length) {
      bodyEl.innerHTML = `
        <div class="leaderboard__row leaderboard__row--data">
          <span class="col-rank">--</span>
          <span class="col-player">No scores yet</span>
          <span class="col-score">0</span>
        </div>
      `;

      renderPlayerRank(playerEntry);
      return;
    }

    leaderboard.slice(0, 10).forEach((entry) => {
      const row = document.createElement("div");
      row.className = `leaderboard__row leaderboard__row--data rank-${entry.rank}`;

      row.innerHTML = `
        <span class="col-rank">#${entry.rank}</span>
        <span class="col-player">${entry.username || "Unknown"}</span>
        <span class="col-score">${entry.value.toLocaleString()}</span>
      `;

      bodyEl.appendChild(row);
    });

    renderPlayerRank(playerEntry);
  } catch (error) {
    console.error(error);
    bodyEl.innerHTML = "<p>Unable to load scores.</p>";
  }
}

function renderPlayerRank(playerEntry) {
  if (playerEntry) {
    playerEl.innerHTML = `
      <span class="col-rank">
        <span class="leaderboard__you-label">YOUR RANK</span>
        #${playerEntry.rank}
      </span>
      <span class="col-player">${playerEntry.username}</span>
      <span class="col-score">${playerEntry.value.toLocaleString()}</span>
    `;
  } else {
    playerEl.innerHTML = `
      <span class="col-rank">
        <span class="leaderboard__you-label">YOUR RANK</span>
        --
      </span>
      <span class="col-player">PLAY FIRST</span>
      <span class="col-score">0</span>
    `;
  }
}

initLeaderboard();
