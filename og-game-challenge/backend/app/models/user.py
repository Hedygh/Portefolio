from app import db
from app.models.base_model import BaseModel


class User(BaseModel):
    """User database model."""

    __tablename__ = "users"

    email = db.Column(db.String(120), nullable=False, unique=True)
    username = db.Column(db.String(80), nullable=False)

    scores = db.relationship(
        "Score",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __init__(self, email, username):
        self.set_email(email)
        self.set_username(username)

    def set_email(self, email):
        """Set user email."""
        if not isinstance(email, str):
            raise TypeError("email must be a string")

        if not email.strip():
            raise ValueError("email cannot be empty")

        self.email = email.strip().lower()

    def set_username(self, username):
        """Set user username."""
        if not isinstance(username, str):
            raise TypeError("username must be a string")

        if not username.strip():
            raise ValueError("username cannot be empty")

        self.username = username.strip()
