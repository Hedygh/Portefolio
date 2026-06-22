from app import db
from app.models.game import Game
from app.models.user import User
from app.models.score import Score


def initialize_database(app):
    """Create database tables and seed default data."""
    with app.app_context():
        db.create_all()
        seed_default_games()


def seed_default_games():
    """Create default games if they do not already exist."""
    if Game.query.count() > 0:
        return

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
        db.session.add(game)

    db.session.commit()
