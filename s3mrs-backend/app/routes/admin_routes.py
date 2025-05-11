from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.utils.security import role_required
from app.models import UserModel
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils.security import role_required
from app.models import RoomModel, BookingModel, UserModel
from app.extensions import mongo   # ← import mongo
bp = Blueprint("admin", __name__)

@bp.get("/users")
@jwt_required()
@role_required("admin")
def list_users():
    users = list(UserModel._col().find({}))
    for u in users:
        u["_id"] = str(u["_id"])
        u.pop("password", None)
    return jsonify(users)
@bp.patch("/users/<user_id>/ban")
@jwt_required()
@role_required("admin")
def ban_user(user_id):
    UserModel.update_banned(user_id, True)
    return jsonify({"msg": "user banned"}), 200

@bp.patch("/users/<user_id>/unban")
@jwt_required()
@role_required("admin")
def unban_user(user_id):
    UserModel.update_banned(user_id, False)
    return jsonify({"msg": "user unbanned"}), 200

@bp.get("/stats")
@jwt_required()
@role_required("admin")
def stats():
    user_count    = mongo.db.users.count_documents({})
    room_count    = mongo.db.rooms.count_documents({})
    pending_count = len(BookingModel.by_state("pending"))
    approved_count= len(BookingModel.by_state("approved"))
    declined_count= len(BookingModel.by_state("declined"))
    return jsonify({
        "user_count": user_count,
        "room_count": room_count,
        "bookings": {
            "pending": pending_count,
            "approved": approved_count,
            "declined": declined_count
        }
    }), 200