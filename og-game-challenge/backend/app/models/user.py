from app.models.base_model import BaseModel


class User(BaseModel):
    """User model."""

    def __init__(self, email, username):
        super().__init__()

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