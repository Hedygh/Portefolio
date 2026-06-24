from flask_restx import Namespace, Resource


api = Namespace("health", description="Health check endpoint")


@api.route("/")
class HealthCheck(Resource):
    def get(self):
        return {"status": "ok", "message": "OG Game Challenge API is running"}, 200
