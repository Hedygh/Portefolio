from app import db
from app.models.base_model import BaseModel


class Score(BaseModel):
    """Score database model."""

    __tablename__ = "scores"

    value = db.Column(db.Integer, nullable=False)

    user_id = db.Column(
        db.String(36),
        db.ForeignKey("users.id"),
        nullable=False
    )

    game_id = db.Column(
        db.String(36),
        db.ForeignKey("games.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="scores"
    )

    game = db.relationship(
        "Game",
        back_populates="scores"
    )

    def __init__(self, user, game, value):
        self.set_user(user)
        self.set_game(game)
        self.set_value(value)

    def set_user(self, user):
        """Set score user."""
        if not user:
            raise ValueError("user cannot be empty")

        self.user = user
        self.user_id = user.id

    def set_game(self, game):
        """Set score game."""
        if not game:
            raise ValueError("game cannot be empty")

        self.game = game
        self.game_id = game.id

    def set_value(self, value):
        """Set score value."""
        if not isinstance(value, int):
            raise TypeError("score value must be an integer")

        if value < 0:
            raise ValueError("score value cannot be negative")

        self.value = value

    def to_dict(self):
        """Return a clean dictionary representation of the score."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None,
            "game_id": self.game_id,
            "game_name": self.game.name if self.game else None,
            "value": self.value,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
