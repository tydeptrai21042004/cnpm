# app/extensions.py

import flask
from werkzeug.local import LocalStack

# Monkey-patch the two names that flask_cas expects
flask._app_ctx_stack     = LocalStack()
flask._request_ctx_stack = LocalStack()

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_cas import CAS
from apscheduler.schedulers.background import BackgroundScheduler

cors      = CORS()
jwt       = JWTManager()
mongo     = PyMongo()
cas       = CAS()
scheduler = BackgroundScheduler()
