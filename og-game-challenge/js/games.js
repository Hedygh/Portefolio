// ═══════════════════════════════════════
// GAMES — Liste des jeux (mock, à connecter à GET /api/v1/games)
// ═══════════════════════════════════════

// TODO: remplacer par un fetch quand le backend est prêt
// const res = await fetch('/api/v1/games');
// const data = await res.json();
// const games = data.games;

const games = [
  {
    id: 1,
    name: 'Obstacle Run',
    description: 'Dodge the obstacles, survive as long as you can, and climb the ranks.',
    icon: '🏃'
  },
  {
    id: 2,
    name: 'Platformer',
    description: 'Jump, run and master each level in this fast-paced retro platformer.',
    icon: '🎮'
  }
];

const grid = document.getElementById('gamesGrid');

games.forEach(game => {
  const card = document.createElement('div');
  card.className = 'game-card';

  card.innerHTML = `
    <div class="game-card__visual">
      <span class="game-card__icon">${game.icon}</span>
    </div>
    <div class="game-card__body">
      <h2 class="game-card__name">${game.name}</h2>
      <p class="game-card__desc">${game.description}</p>
      <div class="game-card__actions">
        <a class="game-card__btn game-card__btn--play" href="game${game.id}.html">PLAY</a>
        <a class="game-card__btn game-card__btn--board" href="leaderboard.html?game=${game.id}">LEADERBOARD</a>
      </div>
    </div>
  `;

  grid.appendChild(card);
});
