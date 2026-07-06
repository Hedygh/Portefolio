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
            "Dodge obstacles, survive as long as possible, and climb the leaderboard."
        ),
        (
            "Platformer Escape",
            "Jump, run, and escape through a retro platform challenge."
        ),
        (
            "Space Runner",
            "Pilot your ship, destroy enemies, dodge meteors and survive as long as possible."
        )
    ]

    for name, description in games:
        game = Game(name=name, description=description)
        db.session.add(game)

    db.session.commit()
