"""Business helpers kept separate from route handlers."""
from datetime import datetime, timedelta
from app.models import BookingModel

GRACE_MINUTES = 10

def auto_cancel_expired(now: datetime):
    """Cancel any booking whose start+grace < now and still 'reserved'."""
    threshold = now - timedelta(minutes=GRACE_MINUTES)
    expired = BookingModel._col().find({
        "state": "reserved",
        "start": {"$lt": threshold}
    })
    for b in expired:
        BookingModel.update_state(b["_id"], "expired")
