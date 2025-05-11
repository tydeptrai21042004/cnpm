# app/models/message_model.py
from datetime import datetime
from bson import ObjectId
from app.extensions import mongo

class MessageModel:
    """MongoDB collection: messages"""

    @staticmethod
    def _col():
        return mongo.db.messages

    @classmethod
    def create(cls, user_id: str, sender: str, content: str):
        doc = {
            "user_id": user_id,       # the student’s ID
            "sender": sender,         # "user" or "admin"
            "content": content,
            "timestamp": datetime.utcnow(),
        }
        result = cls._col().insert_one(doc)
        return str(result.inserted_id)

    @classmethod
    def by_user(cls, user_id: str):
        msgs = list(cls._col()
                    .find({"user_id": user_id})
                    .sort("timestamp", 1))
        for m in msgs:
            m["_id"] = str(m["_id"])
            m["timestamp"] = m["timestamp"].isoformat()
        return msgs
