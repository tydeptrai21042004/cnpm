# app/routes/room_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from bson import ObjectId
from app.utils.security import role_required
from app.models import RoomModel

bp = Blueprint("rooms", __name__, url_prefix="/api/rooms")

@bp.get("/")
@jwt_required(optional=True)
def list_rooms():
    capacity = request.args.get("capacity", type=int)
    type_    = request.args.get("type")
    query: dict = {}
    if capacity is not None:
        query["capacity"] = {"$gte": capacity}
    if type_:
        query["type"] = type_
    rooms = RoomModel.list(query)
    return jsonify(rooms), 200

@bp.post("/")
@jwt_required()
@role_required("admin")
def create_room():
    data = request.get_json()
    name     = data["name"]
    capacity = data["capacity"]
    type_    = data["type"]
    position = data.get("position", {"x":0,"y":0,"z":0})
    rid = RoomModel.create(name, capacity, type_, position)
    return jsonify({"id": rid}), 201

@bp.patch("/<room_id>")
@jwt_required()
@role_required("admin")
def update_room(room_id):
    data = request.get_json()
    allowed = {"name", "capacity", "type", "status", "position", "light"}
    updates = {k: v for k, v in data.items() if k in allowed}
    if not updates:
        return jsonify({"msg": "Nothing to update"}), 400
    RoomModel.update(room_id, updates)
    return jsonify({"msg": "updated"}), 200

@bp.delete("/<room_id>")
@jwt_required()
@role_required("admin")
def delete_room(room_id):
    if not RoomModel.delete(room_id):
        return jsonify({"msg": "Room not found"}), 404
    return jsonify({"msg": "deleted"}), 200
import requests
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from app.utils.security import role_required
from app.models import RoomModel
DEVICE_IP = "192.168.227.32"


@bp.route("/<room_id>/light", methods=["GET", "PATCH"])
@jwt_required(optional=True)
def light(room_id):
    # Fetch the room
    room = RoomModel.find_by_id(room_id)
    if not room:
        return jsonify({"msg": "Room not found"}), 404

    # Compute 1-based index from position: z*9 + y*3 + x + 1
    pos = room.get("position", {"x": 0, "y": 0, "z": 0})
    idx = pos.get("z", 0) * 9 + pos.get("y", 0) * 3 + pos.get("x", 0) + 1

    # GET: return room_id, light state, device IP, and index
    if request.method == "GET":
        return jsonify({
            "room_id":   room_id,
            "light":     room["light"],
            "device_ip": DEVICE_IP,
            "index":     idx
        }), 200

    # PATCH: only admins
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Forbidden"}), 403

    data = request.get_json()
    if "light" not in data or not isinstance(data["light"], bool):
        return jsonify({"msg": "'light' (boolean) required"}), 400

    # Update DB
    RoomModel.update_light(room_id, data["light"])

    # Push to the hard-coded device IP, including our new index param
    try:
        resp = requests.get(
            f"http://{DEVICE_IP}/light",
            params={
                "state": "on" if data["light"] else "off",
                "index": idx
            },
            timeout=2
        )
        resp.raise_for_status()
    except Exception as e:
        current_app.logger.error(f"Failed to notify device {DEVICE_IP}: {e}")

    # Return the new state plus index
    return jsonify({
        "room_id":   room_id,
        "light":     data["light"],
        "device_ip": DEVICE_IP,
        "index":     idx
    }), 200
