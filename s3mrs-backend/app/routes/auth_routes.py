# app/routes/auth_routes.py

from flask import Blueprint, request, jsonify, redirect, current_app
from flask_jwt_extended import create_access_token
from app.models import UserModel
from flask_cas import login_required as cas_login_required
from app.extensions import cas    # ← your CAS() instance

bp = Blueprint("auth", __name__)


@bp.post("/register")
def register():
    data = request.get_json()
    email = data["email"].lower()
    password = data["password"]
    role = data.get("role", "student")
    try:
        UserModel.create(email, password, role)
    except ValueError as e:
        return jsonify({"msg": str(e)}), 400
    return jsonify({"msg": "registered"}), 201


@bp.post("/login")
def login():
    data = request.get_json()
    email = data["email"].lower()
    password = data["password"]
    if not UserModel.verify_password(email, password):
        return jsonify({"msg": "Bad credentials"}), 401

    user = UserModel.find_by_email(email)
    access_token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]}
    )
    return jsonify(access_token=access_token), 200


@bp.get("/login/sso")
@cas_login_required
def login_sso():
    # cas.username is provided by the flask_cas CAS() extension
    username = cas.username
    email = f"{username}@hcmut.edu.vn"

    # find or create the user in Mongo
    user = UserModel.find_by_email(email)
    if not user:
        user = UserModel.create(email, "", role="student")

    # generate our JWT
    token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"]}
    )

    # redirect back to React with ?token=…
    frontend = current_app.config["FRONTEND_URL"]
    return redirect(f"{frontend}/?token={token}")
