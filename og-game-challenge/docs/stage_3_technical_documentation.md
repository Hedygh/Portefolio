# Stage 3 — Technical Documentation

## 1. Overview

This document provides a detailed technical blueprint for the **OG Game Challenge** project. It translates the project idea into a structured plan covering system architecture, data models, APIs, and development strategies.

The goal of this document is to ensure that all team members share a clear understanding of how the system will be built before development begins.

---

## 2. User Stories

The following user stories describe the core functionalities of the MVP from the user’s perspective.

### Must Have

* As a user, I want to create an account with my email and username, so that I can have a player identity.
* As a user, I want to access my profile, so that I can view my information.
* As a player, I want to select a game, so that I can start playing immediately.
* As a player, I want to play a mini-game, so that I can challenge myself.
* As a player, I want my score to be saved after a game, so that I can track my performance.
* As a player, I want to see the top 10 leaderboard for each game, so that I can compare myself with others.
* As a player, I want to see my personal ranking, so that I know where I stand.

### Should Have

* As a player, I want multiple mini-games available, so that I have variety.
* As a player, I want a smooth and responsive interface, so that the experience feels modern.

### Could Have

* As a player, I want visual effects and animations, so that the experience is more immersive.

### Won’t Have

* Multiplayer gameplay
* Chat system
* Mobile application
* Google authentication

---

## 3. System Architecture

The application follows a classic web architecture composed of frontend, backend API, and database.

### Components

* Frontend: HTML, CSS, JavaScript game logic included
* Backend: Flask with Flask-RESTX REST API
* Database: SQLite using SQLAlchemy ORM

### Data Flow

1. The user interacts with the frontend browser.
2. The frontend sends HTTP requests to the Flask API.
3. The API processes requests and interacts with the database.
4. The database returns data to the API.
5. The API responds to the frontend in JSON format.
6. The frontend updates the UI accordingly.

Mini-games run in the browser JavaScript and send the score to the backend when a game session ends.

---

## 4. Components and Class Design

### Backend Core Classes

#### User

* id integer, primary key
* email string, unique
* created_at datetime

#### PlayerProfile

* id integer, primary key
* user_id foreign key
* username string, unique

#### Game

* id integer, primary key
* name string
* description string

#### Score

* id integer, primary key
* player_id foreign key
* game_id foreign key
* value integer
* created_at datetime

---

### Relationships

* One User has one PlayerProfile
* One PlayerProfile can have many Scores
* One Game can have many Scores
* Each Score belongs to one Game and one PlayerProfile

---

## 5. Database Design

The project uses a relational database SQLite for development.

### Tables Overview

* users
* player_profiles
* games
* scores

### Key Constraints

* email must be unique
* username must be unique
* scores are linked to both player and game

---

## 6. Sequence Diagrams — Key Use Cases

The system includes three critical interactions:

### 1. User Registration

* User enters email and username
* Frontend sends request to API
* API creates user and profile
* Database stores data
* API returns confirmation

### 2. Play Game

* User selects a game
* Frontend loads game
* User plays locally in browser
* Game ends with a score

### 3. Save Score

* Frontend sends score to API
* API validates data
* Score is stored in database
* API returns updated ranking

---

## 7. API Specifications

### Base URL

/api/v1

---

### Authentication / User

POST /auth/register

Input:
{
"email": "[user@example.com]mailto:user@example.com",
"username": "Player123"
}

Output:
{
"message": "User created",
"user_id": 1
}

---

### Games

GET /games

Output:
{
"games": [
{ "id": 1, "name": "Obstacle Run" },
{ "id": 2, "name": "Platformer" }
]
}

---

### Scores

POST /scores

Input:
{
"game_id": 1,
"score": 1500
}

Output:
{
"message": "Score saved"
}

---

### Leaderboard

GET /leaderboard/<game_id>

Output:
{
"top10": [
{ "username": "Player1", "score": 2000 },
{ "username": "Player2", "score": 1800 }
],
"player_rank": {
"rank": 15,
"score": 1200
}
}

---

## 8. External APIs

No external APIs are used in the MVP.

Google authentication is considered as a future improvement but is out of scope for the current version.

---

## 9. SCM Strategy

The project will use Git and GitHub for version control.

### Branching Strategy

* main: stable version
* develop: integration branch
* feature branches: one branch per feature

Examples:

* feature/auth
* feature/profile
* feature/leaderboard
* feature/game1

### Workflow

* Developers create feature branches
* Code is reviewed before merging
* Pull requests are required
* Frequent commits are encouraged

---

## 10. QA Strategy

### Backend Testing

* API testing using Postman or curl
* Validation of inputs and error handling

### Frontend Testing

* Manual testing of UI and gameplay
* Browser testing

### Database Testing

* Verify score persistence
* Verify leaderboard accuracy

---

## 11. Technical Justifications

The following technologies were selected based on project requirements:

* Flask-RESTX: provides structured API development and documentation
* SQLAlchemy: simplifies database interaction with ORM
* SQLite: lightweight and sufficient for MVP
* JavaScript: required for browser-based mini-games
* REST API: ensures separation between frontend and backend

The architecture is designed to be simple, scalable, and aligned with the team’s current technical skills.

---

## 12. Summary

This technical documentation defines the structure and behavior of the OG Game Challenge application.

It ensures that all aspects of the system are planned before development begins, reducing uncertainty and improving development efficiency.

The document serves as a foundation for implementing the MVP in a structured and collaborative way.
