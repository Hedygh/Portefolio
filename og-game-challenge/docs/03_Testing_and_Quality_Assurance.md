# Testing and Quality Assurance

**Project:** OG Game Challenge

**Project Duration:** June 15, 2026 – June 30, 2026

---

# Testing Strategy

The project relied primarily on manual testing throughout the development process.

Each component was tested independently before being integrated into the final application. Once integration was completed, end-to-end manual testing was performed to verify that all components worked together as expected.

This iterative testing approach helped identify issues early and reduced integration problems during the final sprint.

---

# Backend Testing

The backend was tested using the integrated Swagger interface before any frontend integration.

Each API endpoint was verified individually to ensure correct functionality and proper error handling.

The following features were tested:

- User registration
- User authentication
- JWT token generation
- Protected endpoints
- CRUD operations
- Leaderboard endpoints
- Input validation
- HTTP status codes
- Error responses

Swagger allowed the backend to be fully validated before exposing the API to the frontend.

---

# Frontend Testing

Once connected to the backend, the frontend was tested directly through the web application.

Manual testing focused on:

- User registration
- Login and logout
- Navigation between pages
- Form validation
- Leaderboard display
- Responsive layout
- Communication with backend APIs

Particular attention was given to ensuring that user interactions produced the expected results without visual or functional inconsistencies.

---

# Game Testing

Each JavaScript game was tested independently before integration into the website.

Testing focused on:

- Game launch
- Player controls
- Score calculation
- Game over conditions
- Restart functionality
- Score submission to the backend

After integration, additional testing confirmed that game sessions correctly communicated with the API and updated the leaderboard.

---

# Integration Testing

After all modules were completed, full application testing was performed.

The objective was to validate the complete user workflow from account creation to score submission.

The complete workflow included:

1. User registration
2. User authentication
3. Access to the game selection
4. Launching a game
5. Playing and generating a score
6. Sending the score to the backend
7. Updating the leaderboard
8. Displaying the new ranking

This testing phase confirmed that communication between the frontend, backend, database and games functioned correctly.

---

# Bug Resolution

Most issues were identified during integration testing.

The main corrections involved:

- API communication adjustments
- Route consistency
- Session validation
- Frontend and backend synchronization
- Minor user interface improvements

Each issue was corrected and retested before validation.

---

# Test Summary

| Component | Testing Method | Status |
|-----------|----------------|--------|
| Backend API | Swagger Manual Testing | ✅ Passed |
| Authentication | Swagger + Website | ✅ Passed |
| Frontend | Manual Testing | ✅ Passed |
| JavaScript Games | Manual Testing | ✅ Passed |
| Leaderboard | Manual Testing | ✅ Passed |
| End-to-End Workflow | Manual Testing | ✅ Passed |

---

# Conclusion

Manual testing throughout development ensured that every major feature operated correctly before final delivery.

Although no automated testing framework was implemented for this MVP, the combination of Swagger validation, browser-based testing and end-to-end integration testing provided confidence in the overall stability and functionality of the application.
