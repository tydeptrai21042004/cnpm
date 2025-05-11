# app/__init__.py

from flask import Flask
from pathlib import Path
from dotenv import load_dotenv

from .config import Config
from .extensions import cors, jwt, mongo, cas, scheduler
from .routes    import register_blueprints
from .tasks     import schedule_reminders

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

def create_app() -> Flask:
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config.from_object(Config())

    # init extensions
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    jwt.init_app(app)
    mongo.init_app(app)
    cas.init_app(app)

    # register blueprints
    register_blueprints(app)

    # schedule your job directly
    scheduler.add_job(
        id="booking_reminders",
        func=schedule_reminders,
        trigger="interval",
        minutes=5
    )
    scheduler.start()

    return app
