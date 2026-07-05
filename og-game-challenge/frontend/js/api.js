const API_BASE_URL = "http://127.0.0.1:5001/api/v1";

function getToken() {
  return localStorage.getItem("og_token");
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
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

// AUTH
async function register(username, email, password) {
  return await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password
    })
  });
}

async function login(username, password) {
  return await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
}

// USERS
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
      value
    })
  });
}

async function getLeaderboard(gameId) {
  return await apiRequest(`/scores/game/${gameId}/leaderboard`);
}