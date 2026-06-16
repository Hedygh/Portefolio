from app.models.base_model import BaseModel
from app.models.user import User
from app.models.game import Game


class Score(BaseModel):
    """Score model."""

    def __init__(self, user, game, value):
        super().__init__()

        self.set_user(user)
        self.set_game(game)
        self.set_value(value)

    def set_user(self, user):
        """Set score user."""
        if not isinstance(user, User):
            raise TypeError("user must be a User instance")

        self.user = user

    def set_game(self, game):
        """Set score game."""
        if not isinstance(game, Game):
            raise TypeError("game must be a Game instance")

        self.game = game

    def set_value(self, value):
        """Set score value."""
        if not isinstance(value, int):
            raise TypeError("score value must be an integer")

        if value < 0:
            raise ValueError("score value cannot be negative")

        self.value = value
