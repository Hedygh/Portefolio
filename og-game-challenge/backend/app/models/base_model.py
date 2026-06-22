from datetime import datetime
from uuid import uuid4

from app import db


class BaseModel(db.Model):
    """Base class for all database models."""

    __abstract__ = True

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def save(self):
        """Save current object."""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Delete current object."""
        db.session.delete(self)
        db.session.commit()

    def update(self, data):
        """Update object attributes from a dictionary."""
        if not isinstance(data, dict):
            return

        for key, value in data.items():
            if key not in {"id", "created_at"}:
                setattr(self, key, value)

        self.save()

    def to_dict(self):
        """Return a dictionary representation of the object."""
        result = {}

        for column in self.__table__.columns:
            value = getattr(self, column.name)

            if isinstance(value, datetime):
                value = value.isoformat()

            result[column.name] = value

        return result
