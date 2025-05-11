# s3mrs-backend/app/routes/__init__.py

from flask import Blueprint
from .docs_routes    import bp as docs_bp       # API docs
from .auth_routes    import bp as auth_bp
from .room_routes    import bp as room_bp
from .booking_routes import bp as booking_bp
from .admin_routes   import bp as admin_bp
from .chat_routes    import bp as chat_bp       # ✨ NEW

def register_blueprints(app):
    app.register_blueprint(docs_bp,    url_prefix="/")             # docs/index
    app.register_blueprint(auth_bp,    url_prefix="/api/auth")     # /api/auth/*
    app.register_blueprint(room_bp,    url_prefix="/api/rooms")    # /api/rooms/*
    app.register_blueprint(booking_bp, url_prefix="/api/bookings") # /api/bookings/*
    app.register_blueprint(admin_bp,   url_prefix="/api/admin")    # /api/admin/*
    app.register_blueprint(chat_bp,    url_prefix="/api/chat")     # 🙋‍♂️ chat endpoints
