// ═══════════════════════════════════════
// API SERVICE — Centralized backend communication
// ═══════════════════════════════════════

const API_BASE_URL = "http://127.0.0.1:5001/api/v1";

// Generic request helper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(url, config);

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || data?.message || "API request failed";
    throw new Error(message);
  }

  return data;
}

// USERS
async function createUser(username, email) {
  return await apiRequest("/users/", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      username: username
    })
  });
}

async function getUser(userId) {
  return await apiRequest(`/users/${userId}`);
}

// GAMES
async function getGames() {
  return await apiRequest("/games/");
}

async function getGame(gameId) {
  return await apiRequest(`/games/${gameId}`);
}

// SCORES
async function submitScore(userId, gameId, value) {
  return await apiRequest("/scores/", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      game_id: gameId,
      value: value
    })
  });
}

async function getLeaderboard(gameId) {
  return await apiRequest(`/scores/game/${gameId}/leaderboard`);
}