# app/models/user_model.py

from passlib.hash import bcrypt
from bson import ObjectId
from app.extensions import mongo

class UserModel:
    """MongoDB collection: users"""

    @staticmethod
    def _col():
        return mongo.db.users

    @classmethod
    def create(cls, email: str, password: str, role: str = "student"):
        if cls._col().find_one({"email": email}):
            raise ValueError("User already exists")
        doc = {
            "email":    email,
            "password": bcrypt.hash(password),
            "role":     role,
            "banned":   False,
        }
        cls._col().insert_one(doc)
        return doc

    @classmethod
    def find_by_email(cls, email: str):
        return cls._col().find_one({"email": email})

    @classmethod
    def find_by_id(cls, user_id: str):
        """Fetch a user by ObjectId string, or return None."""
        try:
            u = cls._col().find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None
        if not u:
            return None
        u["_id"] = str(u["_id"])
        u.pop("password", None)
        return u

    @classmethod
    def verify_password(cls, email: str, password: str) -> bool:
        user = cls.find_by_email(email)
        return bool(user and bcrypt.verify(password, user["password"]))

    @classmethod
    def list_all(cls):
        users = list(cls._col().find())
        for u in users:
            u["_id"] = str(u["_id"])
            u.pop("password", None)
        return users

    @classmethod
    def update_banned(cls, user_id: str, banned: bool):
        cls._col().update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"banned": banned}}
        )
