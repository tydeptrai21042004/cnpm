"""Stub; plug in e‑mail or FCM later."""
from flask import current_app

def send_notification(user_id: str, title: str, body: str):
    current_app.logger.info(f"[Notification] {user_id}: {title} – {body}")
