import tempfile
import unittest
from pathlib import Path

from app import create_app, db


class ApiTestCase(unittest.TestCase):
    """Integration tests for the public API contract."""

    def setUp(self):
        self.temp_directory = tempfile.TemporaryDirectory()
        database_path = Path(self.temp_directory.name) / "test.db"

        class TestConfig:
            TESTING = True
            SECRET_KEY = "test-secret-key-with-at-least-32-bytes"
            JWT_SECRET_KEY = "test-jwt-key-with-at-least-32-bytes"
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{database_path}"
            SQLALCHEMY_TRACK_MODIFICATIONS = False

        self.app = create_app(TestConfig)
        self.client = self.app.test_client()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

        self.temp_directory.cleanup()

    def register(self, username="alice", email="alice@example.com"):
        response = self.client.post(
            "/api/v1/auth/register",
            json={
                "username": username,
                "email": email,
                "password": "secure-password"
            }
        )
        self.assertEqual(response.status_code, 201)
        return response.get_json()

    @staticmethod
    def auth_header(token):
        return {"Authorization": f"Bearer {token}"}

    def test_health_and_games_are_available(self):
        health = self.client.get("/api/v1/health/")
        games = self.client.get("/api/v1/games/")

        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.get_json()["status"], "ok")
        self.assertEqual(games.status_code, 200)
        self.assertEqual(len(games.get_json()), 3)

    def test_register_login_and_read_own_profile(self):
        registration = self.register()
        token = registration["access_token"]
        user_id = registration["user"]["id"]

        self.assertNotIn("password_hash", registration["user"])

        login = self.client.post(
            "/api/v1/auth/login",
            json={"username": "alice", "password": "secure-password"}
        )
        unauthenticated = self.client.get(f"/api/v1/users/{user_id}")
        profile = self.client.get(
            f"/api/v1/users/{user_id}",
            headers=self.auth_header(token)
        )

        self.assertEqual(login.status_code, 200)
        self.assertEqual(unauthenticated.status_code, 401)
        self.assertEqual(profile.status_code, 200)
        self.assertEqual(profile.get_json()["username"], "alice")
        self.assertNotIn("password_hash", profile.get_json())

    def test_registration_is_only_available_through_auth_route(self):
        response = self.client.post(
            "/api/v1/users/",
            json={"username": "alice", "email": "alice@example.com"}
        )

        self.assertEqual(response.status_code, 404)

    def test_duplicate_registration_and_invalid_login_are_rejected(self):
        self.register()
        duplicate = self.client.post(
            "/api/v1/auth/register",
            json={
                "username": "alice",
                "email": "alice@example.com",
                "password": "secure-password"
            }
        )
        invalid_login = self.client.post(
            "/api/v1/auth/login",
            json={"username": "alice", "password": "wrong-password"}
        )

        self.assertEqual(duplicate.status_code, 400)
        self.assertEqual(invalid_login.status_code, 401)

    def test_user_cannot_read_another_profile(self):
        alice = self.register()
        bob = self.register("bob", "bob@example.com")

        response = self.client.get(
            f"/api/v1/users/{bob['user']['id']}",
            headers=self.auth_header(alice["access_token"])
        )

        self.assertEqual(response.status_code, 403)

    def test_score_requires_jwt_and_uses_authenticated_identity(self):
        alice = self.register()
        bob = self.register("bob", "bob@example.com")
        game_id = self.client.get("/api/v1/games/").get_json()[0]["id"]
        payload = {
            "user_id": bob["user"]["id"],
            "game_id": game_id,
            "value": 120
        }

        unauthenticated = self.client.post("/api/v1/scores/", json=payload)
        authenticated = self.client.post(
            "/api/v1/scores/",
            json=payload,
            headers=self.auth_header(alice["access_token"])
        )

        self.assertEqual(unauthenticated.status_code, 401)
        self.assertEqual(authenticated.status_code, 201)
        self.assertEqual(
            authenticated.get_json()["user_id"],
            alice["user"]["id"]
        )

    def test_lower_score_does_not_replace_personal_best(self):
        alice = self.register()
        headers = self.auth_header(alice["access_token"])
        game_id = self.client.get("/api/v1/games/").get_json()[0]["id"]

        first = self.client.post(
            "/api/v1/scores/",
            json={"game_id": game_id, "value": 200},
            headers=headers
        )
        second = self.client.post(
            "/api/v1/scores/",
            json={"game_id": game_id, "value": 50},
            headers=headers
        )
        leaderboard = self.client.get(
            f"/api/v1/scores/game/{game_id}/leaderboard"
        )

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 201)
        self.assertEqual(second.get_json()["value"], 200)
        self.assertEqual(leaderboard.get_json()[0]["value"], 200)


if __name__ == "__main__":
    unittest.main()
