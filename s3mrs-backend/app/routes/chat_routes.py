# app/routes/chat_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.security import role_required
from app.models.message_model import MessageModel
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.security import role_required
from app.models.message_model import MessageModel
from app.models.user_model import UserModel
from app.extensions import mongo  # for distinct
from bson import ObjectId
bp = Blueprint("chat", __name__, url_prefix="/api/chat")

@bp.get("/messages")
@jwt_required()
def get_messages():
    uid = get_jwt_identity()
    msgs = MessageModel.by_user(uid)
    return jsonify(msgs), 200

@bp.post("/messages")
@jwt_required()
def post_message():
    data = request.get_json()
    uid     = get_jwt_identity()
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"msg": "Empty message"}), 400
    mid = MessageModel.create(uid, "user", content)
    return jsonify({"id": mid}), 201

@bp.post("/admin/reply")
@jwt_required()
@role_required("admin")
def admin_reply():
    data = request.get_json()
    user_id = data.get("user_id")
    content = data.get("content", "").strip()
    if not user_id or not content:
        return jsonify({"msg": "user_id and content required"}), 400
    mid = MessageModel.create(user_id, "admin", content)
    return jsonify({"id": mid}), 201
@bp.get("/users")
@jwt_required()
@role_required("admin")
def chat_users():
    user_ids = mongo.db.messages.distinct("user_id")
    out = []
    for uid in user_ids:
        u = UserModel.find_by_id(uid)
        if u:
            out.append({"id": uid, "email": u["email"]})
    return jsonify(out), 200

# ✨ New: get any user's messages
@bp.get("/messages/<user_id>")
@jwt_required()
@role_required("admin")
def admin_get_messages(user_id):
    msgs = MessageModel.by_user(user_id)
    return jsonify(msgs), 200