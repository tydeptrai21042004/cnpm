# app/utils/security.py

from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import abort

def role_required(required_role: str):
    """Decorator enforcing a single-role check."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") != required_role:
                abort(403, description="Forbidden: insufficient privileges")
            return fn(*args, **kwargs)
        return wrapper
    return decorator
