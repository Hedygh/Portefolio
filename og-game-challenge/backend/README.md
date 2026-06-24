# OG Game Challenge - Backend

## Overview

OG Game Challenge is a web application that allows players to compete in simple browser-based mini-games and compare their performance through online leaderboards.

The backend is built with Flask and Flask-RESTX and follows a layered architecture inspired by the HBnB project. The application exposes a REST API used by the frontend and the JavaScript games to manage users, games, scores, and leaderboards.

The primary objective of the backend is to:

* Manage player profiles
* Store game information
* Record scores submitted by games
* Generate leaderboards
* Provide a scalable architecture for future features

---

## Technologies Used

### Flask

Flask is the core web framework used to create the application and manage HTTP requests.

Responsibilities:

* Application creation
* Request handling
* Routing
* Configuration management

---

### Flask-RESTX

Flask-RESTX is used to build and document the REST API.

Responsibilities:

* API namespaces
* Route management
* Request validation
* Swagger documentation

Swagger UI is available through the API and allows testing endpoints directly from the browser.

---

### SQLAlchemy

SQLAlchemy is used as the Object Relational Mapper (ORM).

Responsibilities:

* Database abstraction
* Model mapping
* Relationship management
* Query generation

The current development database uses SQLite.

---

### SQLite

SQLite is used during development as a lightweight local database.

Advantages:

* No server installation required
* Easy setup
* Portable database file

Future deployments may use MySQL or PostgreSQL without requiring major changes to the application logic.

---

## Architecture

The backend follows a layered architecture:

```text
API Layer
    ↓
Service / Facade Layer
    ↓
Repository Layer
    ↓
Database Layer
```

Each layer has a specific responsibility.

---

## Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   └── v1/
│   │
│   ├── models/
│   │
│   ├── repositories/
│   │
│   ├── services/
│   │
│   ├── db_init.py
│   └── __init__.py
│
├── config.py
├── run.py
└── requirements.txt
```

---

## Data Models

### BaseModel

BaseModel is the parent class of all business models.

Common attributes:

* id
* created_at
* updated_at

Common methods:

* save()
* delete()
* update()
* to_dict()

---

### User

Represents a player profile.

Attributes:

* id
* email
* username
* created_at
* updated_at

A user can own multiple scores.

---

### Game

Represents a playable mini-game.

Attributes:

* id
* name
* description
* created_at
* updated_at

A game can receive multiple scores.

Example games:

* Dodge Runner
* Endless Jumper
* Falling Blocks

---

### Score

Represents a completed game session.

Attributes:

* id
* value
* user_id
* game_id
* created_at
* updated_at

A score belongs to:

* One user
* One game

---

## Entity Relationships

```text
User
  │
  │ 1
  │
  ▼
Score
  ▲
  │
  │ *
  │
Game
```

More precisely:

```text
User 1 -------- * Score * -------- 1 Game
```

Meaning:

* One user can have many scores
* One game can have many scores
* Each score belongs to exactly one user and one game

---

## Repository Layer

The repository layer is responsible for data access.

A generic SQLAlchemy repository is used to:

* Add objects
* Retrieve objects
* Retrieve collections
* Delete objects

This layer isolates database logic from business logic.

---

## Service Layer

The service layer is implemented through the GameChallengeFacade.

Responsibilities:

* User creation
* User retrieval
* Game retrieval
* Score submission
* Leaderboard generation

The API never directly manipulates database objects.

Instead:

```text
API
 ↓
Facade
 ↓
Repository
 ↓
Database
```

This separation improves maintainability and scalability.

---

## Database Initialization

Database initialization is handled by:

```text
app/db_init.py
```

Responsibilities:

1. Create database tables
2. Seed default games
3. Prevent duplicate game creation

Default games are automatically inserted during the first application startup.

---

## API Endpoints

### Health

```http
GET /api/v1/health/
```

Returns application status.

---

### Games

Get all available games:

```http
GET /api/v1/games/
```

Get a specific game:

```http
GET /api/v1/games/<game_id>
```

---

### Users

Create or retrieve a user:

```http
POST /api/v1/users/
```

Example:

```json
{
  "email": "player@example.com",
  "username": "PlayerOne"
}
```

Get a user:

```http
GET /api/v1/users/<user_id>
```

---

### Scores

Submit a score:

```http
POST /api/v1/scores/
```

Example:

```json
{
  "user_id": "USER_ID",
  "game_id": "GAME_ID",
  "value": 1500
}
```

Get a leaderboard:

```http
GET /api/v1/scores/game/<game_id>/leaderboard
```

---

## Leaderboard System

The leaderboard is generated dynamically from stored scores.

Process:

1. Retrieve all scores for a game
2. Sort scores in descending order
3. Return the top results

Example:

```text
1. PlayerOne  2500
2. PlayerTwo  1800
3. PlayerThree 1500
```

---

## Future Improvements

Potential future enhancements include:

* JWT authentication
* Password hashing with Bcrypt
* Google OAuth integration
* User profiles and statistics
* Global rankings
* Multiple leaderboard categories
* Achievement system
* Multiplayer support
* MySQL/PostgreSQL deployment
* Docker containerization
* CI/CD pipelines

---

## Development Status

Current status:

* Flask application structure completed
* REST API implemented
* SQLAlchemy integration completed
* SQLite database configured
* Models and relationships implemented
* Leaderboard system implemented
* Automatic database initialization implemented

The backend is now ready to be connected to the frontend application and JavaScript mini-games.
