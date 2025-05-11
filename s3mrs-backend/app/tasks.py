# app/tasks.py

from datetime import datetime, timedelta
from flask import current_app
from app.extensions import mongo
from app.models import BookingModel, UserModel, RoomModel
from app.utils.email import send_email
from bson import ObjectId

def schedule_reminders():
    """
    Find all approved bookings starting in the next hour
    for which we have not yet sent a reminder, email the user,
    and mark reminder_sent=True.
    """
    now = datetime.utcnow()
    one_hour = now + timedelta(hours=1)

    # Query approved bookings that start within (now, one_hour]
    col = mongo.db.bookings
    to_remind = col.find({
        "state": "approved",
        "reminder_sent": False,
        "start": {"$gt": now, "$lte": one_hour}
    })

    for booking in to_remind:
        uid    = booking["user_id"]
        rid    = booking["room_id"]
        start  = booking["start"]
        end    = booking["end"]

        # Load user & room
        user = UserModel.find_by_id(uid)
        room = RoomModel.find_by_id(rid)
        if not user or not room:
            continue

        # Build email
        subject = "Reminder: your room booking starts in 1 hour"
        body = (
            f"Hello,\n\n"
            f"This is a reminder that your booking for room '{room['name']}'\n"
            f"starts at {start.isoformat()} and ends at {end.isoformat()}.\n\n"
            "Thank you."
        )

        try:
            send_email(subject, user["email"], body)
            # Mark as sent
            col.update_one(
                {"_id": booking["_id"]},
                {"$set": {"reminder_sent": True}}
            )
            current_app.logger.info(f"Sent reminder for booking {booking['_id']}")
        except Exception as e:
            current_app.logger.error(f"Failed to send reminder for booking {booking['_id']}: {e}")
