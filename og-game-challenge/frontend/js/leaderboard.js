// ═══════════════════════════════════════
// LEADERBOARD — mock (à connecter à GET /api/v1/leaderboard/<game_id>)
// ═══════════════════════════════════════

const GAMES = [
  { id: 1, name: 'Obstacle Run' },
  { id: 2, name: 'Platformer' }
];

// Données mock par jeu — à remplacer par un fetch backend
const MOCK_DATA = {
  1: {
    top10: [
      { username: 'NeoPixel',    score: 9820 },
      { username: 'GhostByte',   score: 8740 },
      { username: 'RetroKing',   score: 8100 },
      { username: 'VaporWave',   score: 7650 },
      { username: 'CyberFox',    score: 7200 },
      { username: 'BitCrusher',  score: 6890 },
      { username: 'SynthLord',   score: 6450 },
      { username: 'GlitchMob',   score: 6010 },
      { username: 'PixelPunk',   score: 5780 },
      { username: 'NightRunner', score: 5340 }
    ],
    player_rank: { rank: 15, score: 4120 }
  },
  2: {
    top10: [
      { username: 'JumpMaster',  score: 12400 },
      { username: 'PlatformPro', score: 11200 },
      { username: 'SkyHopper',   score: 10800 },
      { username: 'CoinHunter',  score: 9900 },
      { username: 'LevelUp',     score: 9300 },
      { username: 'SpeedRun',    score: 8700 },
      { username: 'GravityKid',  score: 8200 },
      { username: 'DoubleJump',  score: 7600 },
      { username: 'PowerStar',   score: 7100 },
      { username: 'WarpZone',    score: 6500 }
    ],
    player_rank: { rank: 8, score: 7600 }
  }
};

const tabsEl   = document.getElementById('gameTabs');
const bodyEl   = document.getElementById('leaderboardBody');
const playerEl = document.getElementById('playerRank');

// Jeu sélectionné via ?game=X dans l'URL, sinon jeu 1
const params = new URLSearchParams(window.location.search);
let currentGame = parseInt(params.get('game')) || 1;

// ── Construit les onglets ──
function renderTabs() {
  tabsEl.innerHTML = '';
  GAMES.forEach(game => {
    const tab = document.createElement('button');
    tab.className = 'tab' + (game.id === currentGame ? ' tab--active' : '');
    tab.textContent = game.name;
    tab.addEventListener('click', () => {
      currentGame = game.id;
      renderTabs();
      renderBoard();
    });
    tabsEl.appendChild(tab);
  });
}

// ── Construit le tableau ──
function renderBoard() {
  // TODO: remplacer par un fetch backend
  // const res = await fetch(`/api/v1/leaderboard/${currentGame}`);
  // const data = await res.json();
  const data = MOCK_DATA[currentGame];

  bodyEl.innerHTML = '';
  data.top10.forEach((entry, index) => {
    const rank = index + 1;
    const row = document.createElement('div');
    row.className = `leaderboard__row leaderboard__row--data rank-${rank}`;
    row.innerHTML = `
      <span class="col-rank">#${rank}</span>
      <span class="col-player">${entry.username}</span>
      <span class="col-score">${entry.score.toLocaleString()}</span>
    `;
    bodyEl.appendChild(row);
  });

  // Rang du joueur
  playerEl.innerHTML = `
    <span class="col-rank">
      <span class="leaderboard__you-label">YOUR RANK</span>
      #${data.player_rank.rank}
    </span>
    <span class="col-player">YOU</span>
    <span class="col-score">${data.player_rank.score.toLocaleString()}</span>
  `;
}

renderTabs();
renderBoard();
