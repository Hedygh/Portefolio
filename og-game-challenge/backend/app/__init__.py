from flask import Flask
from app.api.v1 import api_bp


def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    app.register_blueprint(api_bp, url_prefix="/api/v1")

    return app
