from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token

from app.services import facade


api = Namespace(
    "auth",
    description="Authentication operations"
)

register_model = api.model("Register", {
    "email": fields.String(required=True, description="User email"),
    "username": fields.String(required=True, description="Username"),
    "password": fields.String(required=True, description="User password")
})

login_model = api.model("Login", {
    "username": fields.String(required=True, description="Username"),
    "password": fields.String(required=True, description="User password")
})


@api.route("/register")
class Register(Resource):
    """Register resource."""

    @api.expect(register_model)
    def post(self):
        """Register a new user."""
        data = api.payload

        try:
            user = facade.register_user(
                data.get("email"),
                data.get("username"),
                data.get("password")
            )
        except (TypeError, ValueError) as error:
            return {"error": str(error)}, 400

        access_token = create_access_token(identity=user.id)

        return {
            "message": "user registered successfully",
            "access_token": access_token,
            "user": user.to_dict()
        }, 201


@api.route("/login")
class Login(Resource):
    """Login resource."""

    @api.expect(login_model)
    def post(self):
        """Login user with username and password."""
        data = api.payload

        user = facade.authenticate_user(
            data.get("username"),
            data.get("password")
        )

        if not user:
            return {"error": "invalid username or password"}, 401

        access_token = create_access_token(identity=user.id)

        return {
            "message": "login successful",
            "access_token": access_token,
            "user": user.to_dict()
        }, 200
