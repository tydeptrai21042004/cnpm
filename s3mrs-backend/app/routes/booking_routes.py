# app/routes/booking_routes.py

from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.security import role_required
from app.models import BookingModel, RoomModel
from app.models.user_model import UserModel
from app.utils.email import send_email

bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")

def _dt(s: str) -> datetime | None:
    """Parse ISO-8601 string, or None if invalid."""
    try:
        return datetime.fromisoformat(s)
    except Exception:
        return None

def _extract_user_id(identity):
    """Return the user’s ID string whether identity is str or dict."""
    if isinstance(identity, dict) and "id" in identity:
        return identity["id"]
    return identity

@bp.post("/")
@jwt_required()
def create_booking():
    data     = request.get_json() or {}
    identity = get_jwt_identity()
    user_id  = _extract_user_id(identity)

    room_id = data.get("room_id")
    start   = _dt(data.get("start", ""))
    end     = _dt(data.get("end", ""))

    if not room_id or not start or not end:
        return jsonify({"msg": "room_id, start, and end (ISO) required"}), 400
    if start >= end:
        return jsonify({"msg": "End must be after start"}), 400

    if BookingModel.overlaps(room_id, start, end):
        return jsonify({"msg": "Room already booked"}), 409
    if BookingModel.user_overlaps(user_id, start, end):
        return jsonify({"msg": "You already have a booking at that time"}), 409

    booking_id = BookingModel.create(user_id, room_id, start, end)
    # only mark RESERVED if capacity reached
    room = RoomModel.find_by_id(room_id)
    if room:
        cap   = room.get("capacity", 1)
        # count how many overlapping now exist
        cnt   = BookingModel.count_overlaps(room_id, start, end)
        if cnt >= cap:
            RoomModel.update_status(room_id, "reserved")
    return jsonify({"id": booking_id}), 201

@bp.get("/mine")
@jwt_required()
def my_bookings():
    user_id = _extract_user_id(get_jwt_identity())
    raw     = BookingModel.by_user(user_id)
    out     = [{
        "_id":     b["_id"],
        "room_id": b["room_id"],
        "start":   b["start"].isoformat(),
        "end":     b["end"].isoformat(),
        "state":   b["state"],
    } for b in raw]
    return jsonify(out), 200

@bp.patch("/<bid>/cancel")
@jwt_required()
def cancel_booking(bid):
    BookingModel.update_state(bid, "canceled")
    return jsonify({"msg": "canceled"}), 200

@bp.get("/requests")
@jwt_required()
@role_required("admin")
def booking_requests():
    raw = BookingModel.by_state("pending")
    out = [{
        "_id":     b["_id"],
        "user_id": b["user_id"],
        "room_id": b["room_id"],
        "start":   b["start"].isoformat(),
        "end":     b["end"].isoformat(),
        "state":   b["state"],
    } for b in raw]
    return jsonify(out), 200

@bp.patch("/<bid>/approve")
@jwt_required()
@role_required("admin")
def approve_booking(bid):
    booking = BookingModel.find_by_id(bid)
    current_app.logger.debug(f"approve_booking: booking = {booking}")
    if not booking:
        return jsonify({"msg": "Booking not found"}), 404

    BookingModel.update_state(bid, "approved")
    all_users = UserModel.list_all()
    all_ids   = [u["_id"] for u in all_users]
    current_app.logger.debug(f"approve_booking: all user IDs in DB = {all_ids}")
    user_id = booking["user_id"]
    current_app.logger.debug(f"approve_booking: user_id = {user_id}")

    user = UserModel.find_by_id(user_id)
    current_app.logger.debug(f"approve_booking: user = {user}")

    if user and user.get("email"):
        subject = "Your booking has been approved"
        body = (
            f"Hello,\n\n"
            f"Your booking for room {booking['room_id']} "
            f"from {booking['start'].isoformat()} to {booking['end'].isoformat()} "
            "has been approved.\n\nThank you."
        )
        current_app.logger.info(f"Sending approval email to {user['email']}")
        try:
            send_email(subject, user["email"], body)
        except Exception as e:
            current_app.logger.error(f"Error sending approval email: {e}")
    else:
        current_app.logger.warning(
            f"No user/email found for booking {bid} (user_id={user_id}), skipping email"
        )

    return jsonify({"msg": "approved"}), 200

@bp.patch("/<bid>/decline")
@jwt_required()
@role_required("admin")
def decline_booking(bid):
    booking = BookingModel.find_by_id(bid)
    if not booking:
        return jsonify({"msg": "Booking not found"}), 404

    BookingModel.update_state(bid, "declined")
    RoomModel.update_status(booking["room_id"], "available")

    user_id = booking["user_id"]
    user    = UserModel.find_by_id(user_id)
    room    = RoomModel.find_by_id(booking["room_id"])

    if user and user.get("email") and room:
        subject = "Your booking has been declined"
        body = (
            f"Hello,\n\n"
            f"Your booking for room '{room['name']}' "
            f"from {booking['start'].isoformat()} to {booking['end'].isoformat()} "
            "has been declined.\n\nPlease contact the admin if needed."
        )
        current_app.logger.info(f"Sending decline email to {user['email']}")
        try:
            send_email(subject, user["email"], body)
        except Exception as e:
            current_app.logger.error(f"Error sending decline email: {e}")
    else:
        current_app.logger.warning(
            f"Skipping decline email for booking {bid} (user_id={user_id})"
        )

    return jsonify({"msg": "declined"}), 200
