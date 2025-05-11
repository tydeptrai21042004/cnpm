# app/models/room_model.py

from bson import ObjectId
from app.extensions import mongo

class RoomModel:
    """MongoDB collection: rooms"""

    @staticmethod
    def _col():
        return mongo.db.rooms

    @classmethod
    def list(cls, query: dict | None = None):
        rooms = list(cls._col().find(query or {}))
        for r in rooms:
            r["_id"] = str(r["_id"])
        return rooms

    @classmethod
    def find_by_id(cls, room_id: str):
        r = cls._col().find_one({"_id": ObjectId(room_id)})
        if not r:
            return None
        r["_id"] = str(r["_id"])
        return r

    @classmethod
    def create(cls, name: str, capacity: int, type_: str, position: dict):
        doc = {
            "name": name,
            "capacity": capacity,
            "type": type_,
            "status": "available",
            "position": position,
            "light": False,    # new default field
        }
        result = cls._col().insert_one(doc)
        return str(result.inserted_id)

    @classmethod
    def update(cls, room_id: str, updates: dict):
        cls._col().update_one(
            {"_id": ObjectId(room_id)},
            {"$set": updates},
        )

    @classmethod
    def delete(cls, room_id: str) -> bool:
        res = cls._col().delete_one({"_id": ObjectId(room_id)})
        return res.deleted_count == 1

    @classmethod
    def update_status(cls, room_id: str, status: str):
        cls.update(room_id, {"status": status})

    @classmethod
    def update_light(cls, room_id: str, light_on: bool):
        cls.update(room_id, {"light": light_on})
