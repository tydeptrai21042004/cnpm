# app/models/booking_model.py

from datetime import datetime
from bson import ObjectId
from app.extensions import mongo

class BookingModel:
    """MongoDB collection: bookings"""

    @staticmethod
    def _col():
        return mongo.db.bookings

    @classmethod
    def create(cls, user_id: str, room_id: str, start: datetime, end: datetime) -> str:
        """Create a new booking in 'pending' state, with reminder_sent=False."""
        doc = {
            "user_id":        user_id,
            "room_id":        room_id,
            "start":          start,
            "end":            end,
            "state":          "pending",
            "reminder_sent":  False,
        }
        result = cls._col().insert_one(doc)
        return str(result.inserted_id)

    @classmethod
    def find_by_id(cls, booking_id: str) -> dict | None:
        b = cls._col().find_one({"_id": ObjectId(booking_id)})
        if not b:
            return None
        b["_id"] = str(b["_id"])
        return b

    @classmethod
    def user_overlaps(cls, user_id: str, start: datetime, end: datetime) -> bool:
        """Return True if this user has an overlapping booking."""
        return bool(cls._col().find_one({
            "user_id": user_id,
            "state":   {"$in": ["pending", "reserved", "approved"]},
            "$or": [
                {"start": {"$lt": end}, "end": {"$gt": start}}
            ]
        }))

    @classmethod
    def overlaps(cls, room_id: str, start: datetime, end: datetime) -> bool:
        """Return True if this room has an overlapping booking."""
        return bool(cls._col().find_one({
            "room_id": room_id,
            "state":   {"$in": ["pending", "reserved", "approved"]},
            "$or": [
                {"start": {"$lt": end}, "end": {"$gt": start}}
            ]
        }))

    @classmethod
    def by_user(cls, user_id: str) -> list[dict]:
        bookings = list(cls._col().find({"user_id": user_id}))
        for b in bookings:
            b["_id"] = str(b["_id"])
        return bookings

    @classmethod
    def by_state(cls, state: str) -> list[dict]:
        bookings = list(cls._col().find({"state": state}))
        for b in bookings:
            b["_id"] = str(b["_id"])
        return bookings

    @classmethod
    def list_all(cls) -> list[dict]:
        bookings = list(cls._col().find())
        for b in bookings:
            b["_id"] = str(b["_id"])
        return bookings

    @classmethod
    def update_state(cls, booking_id: str, state: str) -> None:
        cls._col().update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"state": state}}
        )

    @classmethod
    def mark_reminder_sent(cls, booking_id: str) -> None:
        cls._col().update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"reminder_sent": True}}
        )
    @classmethod
    def count_overlaps(cls, room_id: str, start: datetime, end: datetime) -> int:
        """Return how many bookings in reserved/approved overlap this slot."""
        return cls._col().count_documents({
            "room_id": room_id,
            "state":  {"$in": ["reserved", "approved"]},
            "$or": [
                {"start": {"$lt": end}, "end": {"$gt": start}}
            ]
        })