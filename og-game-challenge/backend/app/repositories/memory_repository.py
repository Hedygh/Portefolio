from app import db


class SQLAlchemyRepository:
    """Generic SQLAlchemy repository."""

    def __init__(self, model):
        """Initialize repository with a model class."""
        self.model = model

    def add(self, obj):
        """Add an object to the database."""
        db.session.add(obj)
        db.session.commit()

    def get(self, obj_id):
        """Get an object by id."""
        return self.model.query.get(obj_id)

    def get_all(self):
        """Get all objects."""
        return self.model.query.all()

    def delete(self, obj_id):
        """Delete an object by id."""
        obj = self.get(obj_id)

        if obj:
            db.session.delete(obj)
            db.session.commit()
