from flask_restx import Namespace, Resource, fields

from app.services import facade


api = Namespace(
    "users",
    description="Users operations"
)

user_model = api.model("User", {
    "email": fields.String(required=True, description="User email"),
    "username": fields.String(required=True, description="User username")
})


@api.route("/")
class UserList(Resource):
    """Users list resource."""

    @api.expect(user_model)
    def post(self):
        """Create or retrieve a user."""
        data = api.payload

        try:
            user = facade.create_user(
                data.get("email"),
                data.get("username")
            )
        except (TypeError, ValueError) as error:
            return {"error": str(error)}, 400

        return user.to_dict(), 201


@api.route("/<string:user_id>")
class UserResource(Resource):
    """Single user resource."""

    def get(self, user_id):
        """Return a user by id."""
        user = facade.get_user(user_id)

        if not user:
            return {"error": "user not found"}, 404

        return user.to_dict(), 200
