# OG Game Challenge
## Project Progress Report

**Project Duration:** June 15, 2026 – June 30, 2026

**Repository:** https://github.com/Hedygh/Portefolio

---

# 1. Project Overview

OG Game Challenge is a web application developed as a team portfolio project. The objective was to create an online platform where authenticated users can register, log in, play retro-style arcade games directly in their browser, and compete through a centralized leaderboard.

Rather than developing a simple game website, the project focused on building a complete MVP following modern software engineering practices. The application combines a REST API, authentication, database management, a responsive front-end interface, and JavaScript browser games into a single integrated system.

The project was intentionally divided into independent components to allow each team member to specialize in a specific domain while maintaining a common architecture for the final integration.

---

# 2. Project Objectives

From the beginning, the team defined several technical and functional objectives.

The primary goal was to deliver a fully functional MVP capable of demonstrating full-stack development skills rather than producing a large-scale commercial product.

The project objectives included:

- Secure user authentication.
- Persistent user management.
- Browser-based JavaScript arcade games.
- Automatic score recording.
- Centralized leaderboard.
- Responsive user interface.
- RESTful API architecture.
- Maintainable and modular source code.
- Clear technical documentation.

Beyond functionality, particular attention was given to software architecture, maintainability, and scalability so that additional games or features could easily be added in future iterations.

---

# 3. Team Organization

The project was divided into three major development areas.

| Team Member | Responsibility |
|-------------|----------------|
| Hedy | Backend API, Database, Authentication, Business Logic |
| Nael | JavaScript Games Development |
| Geoffray | Front-End Development |

This separation allowed each developer to progress independently while reducing merge conflicts during the first development phase.

However, this organization also required clearly defined interfaces between components, especially concerning API communication and score management.

---

# 4. Initial Planning

Before writing code, the team agreed on the overall software architecture.

The application was designed around three independent modules:

- Backend
- Frontend
- JavaScript Games

Each module could be developed separately while respecting predefined communication rules.

The backend would expose REST endpoints responsible for:

- user authentication;
- score management;
- leaderboard retrieval;
- session validation.

The frontend would consume these endpoints and provide the user interface.

The games would remain independent JavaScript applications capable of communicating with the backend through a lightweight score adapter.

This architectural decision significantly simplified the final integration phase.

---

# 5. Sprint 1 – Independent Development

During the first development phase, each team member focused exclusively on their assigned responsibilities.

## Backend Development

The backend was developed using Flask and Flask-RESTx following a layered architecture.

Several major components were implemented:

- REST API
- JWT Authentication
- User management
- Password hashing
- Database integration
- Leaderboard endpoints
- Swagger documentation

The backend evolved incrementally.

Development began with an in-memory repository to validate the business logic before progressively introducing SQLAlchemy and persistent storage.

This approach reduced complexity during the early stages while keeping the application architecture flexible.

---

## Front-End Development

The front-end was implemented using vanilla HTML, CSS and JavaScript.

The objective was to create a lightweight and responsive interface without relying on external frameworks.

Particular attention was given to:

- responsive layouts;
- user navigation;
- authentication pages;
- leaderboard visualization;
- game integration.

The visual identity adopted a modern cyberpunk-inspired design contrasting with the retro aesthetic of the games.

---

## Games Development

The games were intentionally designed with simple mechanics inspired by classic arcade titles.

The objective was not to maximize playtime but rather to encourage replayability through score competition.

Each game followed identical integration principles:

- browser execution;
- score generation;
- game over detection;
- communication with the backend.

Using a common score adapter greatly simplified future integration.

---

# 6. Challenges Encountered During Development

Although each module progressed independently, several technical challenges appeared throughout development.

## API Standardization

One of the earliest challenges involved defining a common communication format between the frontend, backend and games.

To avoid compatibility issues during integration, all exchanged data were standardized using JSON responses with consistent status codes.

This decision considerably reduced debugging time later in the project.

---

## Authentication

JWT authentication introduced additional complexity.

The backend had to securely generate tokens while ensuring protected endpoints remained accessible only to authenticated users.

Careful testing using Swagger helped validate:

- login;
- authorization headers;
- protected routes;
- invalid credentials;
- expired sessions.

---

## Repository Evolution

The backend initially relied on an in-memory repository during business logic development.

While this accelerated early development, migrating to SQLAlchemy required refactoring several repository methods without breaking the API.

Because repository patterns had been adopted from the beginning, this migration remained relatively straightforward.

---

## Git Collaboration

As development progressed, several merge conflicts appeared during the integration phase.

Since frontend, backend and games evolved separately, synchronizing directory structures and resolving conflicting changes became necessary before producing the final MVP.

The team adopted feature branches and pull request reviews to reduce integration risks.

---

# 7. Sprint 2 – Final Integration

The second development phase focused entirely on integration.

The objective shifted from implementing new features to connecting the three independent components into a single application.

Major integration tasks included:

- connecting frontend authentication to backend APIs;
- integrating JavaScript games into the website;
- connecting score submission endpoints;
- displaying leaderboard data;
- validating user sessions;
- final UI adjustments.

This phase required continuous communication between team members because changes in one component often affected another.

---

# 8. Integration Challenges and Solutions

The integration phase revealed several issues that could not be detected while developing components independently.

The most significant challenge involved ensuring consistent communication between browser games and backend services.

A dedicated score adapter was introduced to isolate game logic from API implementation.

This abstraction reduced coupling and made future game additions considerably easier.

Another important challenge involved ensuring authentication remained valid across the entire user workflow.

Extensive testing confirmed that authenticated users could navigate, launch games and submit scores without breaking the session.

---

# 9. Testing Phase

Testing was performed continuously throughout development rather than exclusively at the end.

Backend validation relied heavily on Swagger, allowing every REST endpoint to be tested independently before frontend integration.

Tests included:

- CRUD operations;
- authentication;
- JWT validation;
- input validation;
- leaderboard endpoints;
- error handling.

Frontend testing focused on:

- navigation;
- responsive behavior;
- API communication;
- user experience.

Game testing verified:

- score calculation;
- game over conditions;
- restart mechanics;
- score transmission.

Finally, end-to-end integration testing ensured every application component communicated correctly.

---

# 10. Final MVP

The completed MVP successfully achieved the project's initial objectives.

Users can:

- create an account;
- authenticate securely;
- access multiple browser games;
- submit scores automatically;
- consult the leaderboard;
- navigate through a responsive interface.

The modular architecture also allows future improvements such as additional games, achievements, multiplayer features or cloud deployment.

---

# 11. Lessons Learned

This project demonstrated that software integration often represents a greater challenge than developing individual features.

Several important lessons emerged:

- defining interfaces early greatly simplifies integration;
- modular architecture reduces maintenance costs;
- consistent API design prevents many integration issues;
- continuous testing identifies problems earlier;
- documentation significantly improves team collaboration.

Perhaps the most valuable lesson was recognizing the importance of communication between developers working on independent components.

---

# 12. Conclusion

OG Game Challenge successfully evolved from three independent development streams into a fully functional full-stack web application.

Beyond delivering the expected MVP, the project provided practical experience in software architecture, API design, authentication, collaborative development, integration testing and technical documentation.

The resulting application forms a solid foundation for future extensions while demonstrating the team's ability to design, implement and integrate multiple software components into a coherent product.
