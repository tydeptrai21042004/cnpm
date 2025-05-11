# app/config.py

import os
from pathlib import Path
from dotenv import load_dotenv

# Point dotenv to your project root and load .env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Config:
    # Environment
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    DEBUG     = FLASK_ENV == "development"

    # NEW: Flask session key (used by flask.session & flask_cas)
    SECRET_KEY = os.getenv(
        "FLASK_SECRET_KEY",
        "11111111111111111111111111111"
    )

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/s3mrs")

    # JWT
    JWT_SECRET_KEY           = os.getenv("JWT_SECRET_KEY", "12345678910")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))

    # Mail / SMTP
    MAIL_SERVER         = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT           = int(os.getenv("MAIL_PORT", 587))
    MAIL_USERNAME       = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD       = os.getenv("MAIL_PASSWORD", "")
    MAIL_USE_TLS        = os.getenv("MAIL_USE_TLS", "true").lower() in ("true", "1", "yes")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", MAIL_USERNAME)

    # CAS (SSO)
    CAS_SERVER      = os.getenv("CAS_SERVER", "https://sso.hcmut.edu.vn/cas")
    CAS_AFTER_LOGIN = os.getenv("CAS_AFTER_LOGIN", "auth.login_sso")
    FRONTEND_URL    = os.getenv("FRONTEND_URL", "http://localhost:5173")
