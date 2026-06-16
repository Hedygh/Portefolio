from datetime import datetime
from uuid import uuid4


class BaseModel:
    """Base class for all business models."""

    IMMUTABLE_FIELDS = {"id", "created_at"}

    def __init__(self):
        """Initialize common attributes."""
        self.id = str(uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def save(self):
        """Update the updated_at timestamp."""
        self.updated_at = datetime.now()

    def update(self, data):
        """Update object attributes from a dictionary."""
        if not isinstance(data, dict):
            return

        for key, value in data.items():
            if key not in self.IMMUTABLE_FIELDS:
                setattr(self, key, value)

        self.save()

    def to_dict(self):
        """Return a dictionary representation of the object."""
        result = self.__dict__.copy()

        result["created_at"] = self.created_at.isoformat()
        result["updated_at"] = self.updated_at.isoformat()

        return result
