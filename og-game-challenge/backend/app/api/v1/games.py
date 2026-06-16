from flask_restx import Namespace, Resource

from app.services import facade


api = Namespace(
    "games",
    description="Games operations"
)


@api.route("/")
class GameList(Resource):
    """Games list resource."""

    def get(self):
        """Return all available games."""
        games = facade.get_all_games()

        return [game.to_dict() for game in games], 200


@api.route("/<string:game_id>")
class GameResource(Resource):
    """Single game resource."""

    def get(self, game_id):
        """Return a game by id."""
        game = facade.get_game(game_id)

        if not game:
            return {"error": "game not found"}, 404

        return game.to_dict(), 200
