# OG Game Challenge — Frontend

Frontend of **OG Game Challenge**, a competitive retro mini-game platform where players register, play browser-based mini-games, save their scores, and compete on per-game leaderboards.

This document covers the **frontend** only. The backend (Flask-RESTX API) lives in `../backend/`.

---

## Tech Stack

- **HTML5** — page structure
- **CSS3** — cyberpunk / retro pixel UI, custom HUD styling
- **Vanilla JavaScript** — no framework, no build step
- **Google Fonts** — Orbitron (display) and Rajdhani (body)
- Communicates with the backend through a REST API (`fetch`)

---

## Folder Structure

```
frontend/
├── assets/
│   └── bg.png                     # Cyberpunk cityscape background
│
├── css/
│   ├── global.css                 # Reset + CSS variables (colors, fonts)
│   ├── index.css                  # Landing page
│   ├── register.css               # Register page
│   ├── games.css                  # Game selection page
│   └── leaderboard.css            # Leaderboard page
│
├── html/
│   ├── index.html                 # Landing / home page
│   ├── register.html              # Player registration
│   ├── games.html                 # Game selection
│   ├── leaderboard.html           # Leaderboard
│   ├── game-dodge-runner.html     # Mini-game 1
│   └── game-platformer-escape.html# Mini-game 2
│
└── js/
    ├── api.js                     # Centralized backend communication
    ├── session.js                 # Local user state + navbar
    ├── score-adapter.js           # Connects games to the backend
    ├── register.js                # Register page logic
    ├── games.js                   # Game selection logic
    ├── leaderboard.js             # Leaderboard logic
    └── games/
        ├── dodge_runner.js        # Mini-game 1 logic
        └── platformer_escape.js   # Mini-game 2 logic
```

---

## Pages

### Home (`index.html`)
Landing page with the cyberpunk hero (animated glow titles, tagline, REGISTER call to action) and the main navigation.

### Register (`register.html`)
Player registration form (username + email). On submit, sends the data to the backend and stores the returned user locally.

### Games (`games.html`)
Game selection screen. Displays the available mini-games as cards, each linking to the game itself and to its leaderboard.

### Leaderboard (`leaderboard.html`)
Shows the top 10 players for the selected game with a podium highlight (gold / silver / bronze) and the current player's personal rank. The game is selected via the `?game=<id>` URL parameter or in-page tabs.

### Mini-games
- **Dodge Runner** (`game-dodge-runner.html`) — survive and dodge obstacles
- **Platformer Escape** (`game-platformer-escape.html`) — jump and run through levels

When a game ends, the score is automatically submitted to the backend.

---

## JavaScript Architecture

The frontend is organized around a few shared modules so that pages stay simple.

### `api.js` — backend communication
Central place for every backend call. Base URL:

```js
const API_BASE_URL = "http://127.0.0.1:5001/api/v1";
```

Exposed functions:

| Function | Method | Endpoint |
|---|---|---|
| `createUser(username, email)` | POST | `/users/` |
| `getUser(userId)` | GET | `/users/{id}` |
| `getGames()` | GET | `/games/` |
| `getGame(gameId)` | GET | `/games/{id}` |
| `submitScore(userId, gameId, value)` | POST | `/scores/` |
| `getLeaderboard(gameId)` | GET | `/scores/game/{id}/leaderboard` |

All requests go through a single `apiRequest()` helper that handles JSON encoding and error messages.

### `session.js` — user state
Manages the logged-in player using `localStorage` under the key `og_user`.

- `getCurrentUser()` — returns the stored user, or `null`
- `logout()` — clears the user and returns to the home page
- `updateNavbar()` — shows the username + LOGOUT when logged in, otherwise a REGISTER link

### `score-adapter.js` — games ↔ backend bridge
Connects the mini-games to the scoring system.

- `handleGameOver(gameKey, value)` — called when a game ends; submits the score for the current user (requires registration) and shows the game-over overlay
- `showGameOverOverlay(data)` — renders the end screen with current score, best score, and actions (Play Again / Leaderboard)

The game id is read from the `?game=<id>` URL parameter.

---

## Running the Frontend

The frontend is static and has no build step. Use a local server (recommended) so that the `fetch` calls to the backend work correctly.

### Option 1 — VS Code Live Server
1. Open the project in VS Code
2. Right-click `html/index.html` → **Open with Live Server**

### Option 2 — Python simple server
```bash
cd frontend
python3 -m http.server 8000
```
Then open `http://localhost:8000/html/index.html`.

> **Note:** the backend must be running on `http://127.0.0.1:5001` for registration, scores, and leaderboards to work. See `../backend/README.md`.

---

## Design

The interface uses a cyberpunk / retro arcade aesthetic:

- **Colors:** deep dark background, purple/violet neon, gold accents (defined as CSS variables in `global.css`)
- **Fonts:** Orbitron for titles, Rajdhani for body text
- **UI motifs:** HUD corner brackets, clip-path angled buttons, neon glow on titles
- Background image (`assets/bg.png`) used across all pages with a dark overlay for readability

---

## Authors

OG Game Challenge — Holberton School portfolio project.

- **Geoffray** — Frontend Lead / Web Security Support
- **Hédy** — Fullstack Coordination / Backend
- **Nael** — JavaScript Game Logic / Gameplay Design
