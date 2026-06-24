from flask import Flask
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def create_app(config_class="config.DevelopmentConfig"):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    from app.api.v1 import api_bp
    from app.db_init import initialize_database

    app.register_blueprint(api_bp, url_prefix="/api/v1")
    initialize_database(app)

    return app
