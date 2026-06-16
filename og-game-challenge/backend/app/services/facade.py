from app.models.user import User
from app.models.game import Game
from app.models.score import Score
from app.repositories.memory_repository import MemoryRepository


class GameChallengeFacade:
    """Main application facade."""

    def __init__(self):
        """Initialize repositories and default data."""
        self.user_repo = MemoryRepository()
        self.game_repo = MemoryRepository()
        self.score_repo = MemoryRepository()

        self._initialize_games()

    def _initialize_games(self):
        """Create default games."""
        games = [
            (
                "Dodge Runner",
                "Avoid obstacles and survive as long as possible."
            ),
            (
                "Endless Jumper",
                "Jump between platforms before falling."
            ),
            (
                "Falling Blocks",
                "Avoid falling hazards and stay alive."
            )
        ]

        for name, description in games:
            game = Game(name, description)
            self.game_repo.add(game)

    def create_user(self, email, username):
        """Create a new user or return existing user by email."""
        existing_user = self.get_user_by_email(email)

        if existing_user:
            return existing_user

        user = User(email, username)
        self.user_repo.add(user)

        return user

    def get_user(self, user_id):
        """Get a user by id."""
        return self.user_repo.get(user_id)

    def get_all_users(self):
        """Get all users."""
        return self.user_repo.get_all()

    def get_user_by_email(self, email):
        """Get a user by email."""
        if not isinstance(email, str):
            return None

        normalized_email = email.strip().lower()

        for user in self.user_repo.get_all():
            if user.email == normalized_email:
                return user

        return None

    def get_game(self, game_id):
        """Get a game by id."""
        return self.game_repo.get(game_id)

    def get_all_games(self):
        """Get all games."""
        return self.game_repo.get_all()

    def submit_score(self, user_id, game_id, value):
        """Submit a new score for a user and a game."""
        user = self.get_user(user_id)
        game = self.get_game(game_id)

        if not user:
            raise ValueError("user not found")

        if not game:
            raise ValueError("game not found")

        score = Score(user, game, value)
        self.score_repo.add(score)

        return score

    def get_all_scores(self):
        """Get all scores."""
        return self.score_repo.get_all()

    def get_game_scores(self, game_id):
        """Get all scores for a specific game."""
        game = self.get_game(game_id)

        if not game:
            raise ValueError("game not found")

        scores = []

        for score in self.score_repo.get_all():
            if score.game.id == game_id:
                scores.append(score)

        return scores

    def get_leaderboard(self, game_id, limit=10):
        """Get leaderboard for a specific game."""
        scores = self.get_game_scores(game_id)

        sorted_scores = sorted(
            scores,
            key=lambda score: score.value,
            reverse=True
        )

        return sorted_scores[:limit]
