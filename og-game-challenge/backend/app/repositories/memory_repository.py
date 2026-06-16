class MemoryRepository:
    """In-memory repository."""

    def __init__(self):
        self._storage = {}

    def add(self, obj):
        self._storage[obj.id] = obj

    def get(self, obj_id):
        return self._storage.get(obj_id)

    def get_all(self):
        return list(self._storage.values())

    def delete(self, obj_id):
        if obj_id in self._storage:
            del self._storage[obj_id]
