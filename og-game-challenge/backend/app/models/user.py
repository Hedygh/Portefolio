from app import bcrypt, db
from app.models.base_model import BaseModel


class User(BaseModel):
    """User database model."""

    __tablename__ = "users"

    email = db.Column(db.String(120), nullable=False, unique=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)

    scores = db.relationship(
        "Score",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __init__(self, email, username, password):
        self.set_email(email)
        self.set_username(username)
        self.set_password(password)

    def set_email(self, email):
        """Set user email."""
        if not isinstance(email, str):
            raise TypeError("email must be a string")

        if not email.strip():
            raise ValueError("email cannot be empty")

        if "@" not in email:
            raise ValueError("email must contain @")

        self.email = email.strip().lower()

    def set_username(self, username):
        """Set user username."""
        if not isinstance(username, str):
            raise TypeError("username must be a string")

        if not username.strip():
            raise ValueError("username cannot be empty")

        self.username = username.strip()

    def set_password(self, password):
        """Hash and store user password."""
        if not isinstance(password, str):
            raise TypeError("password must be a string")

        if not password.strip():
            raise ValueError("password cannot be empty")

        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def verify_password(self, password):
        """Verify a password against stored hash."""
        if not isinstance(password, str):
            return False

        return bcrypt.check_password_hash(self.password_hash, password)
