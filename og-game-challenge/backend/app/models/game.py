from app import db
from app.models.base_model import BaseModel


class Game(BaseModel):
    """Game database model."""

    __tablename__ = "games"

    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)

    scores = db.relationship(
        "Score",
        back_populates="game",
        cascade="all, delete-orphan"
    )

    def __init__(self, name, description=""):
        self.set_name(name)
        self.set_description(description)

    def set_name(self, name):
        """Set game name."""
        if not isinstance(name, str):
            raise TypeError("name must be a string")

        if not name.strip():
            raise ValueError("name cannot be empty")

        self.name = name.strip()

    def set_description(self, description):
        """Set game description."""
        if not isinstance(description, str):
            raise TypeError("description must be a string")

        self.description = description.strip()
