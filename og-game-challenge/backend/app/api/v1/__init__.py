from flask import Blueprint
from flask_restx import Api

from app.api.v1.health import api as health_ns
from app.api.v1.games import api as games_ns

# Future namespaces
from app.api.v1.users import api as users_ns
from app.api.v1.scores import api as scores_ns


api_bp = Blueprint("api_v1", __name__)

api = Api(
    api_bp,
    title="OG Game Challenge API",
    version="1.0",
    description="Backend API for OG Game Challenge"
)

api.add_namespace(health_ns, path="/health")
api.add_namespace(games_ns, path="/games")

# Future namespaces
api.add_namespace(users_ns, path="/users")
api.add_namespace(scores_ns, path="/scores")
