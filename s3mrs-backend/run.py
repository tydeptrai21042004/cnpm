# run.py

from app import create_app
from app.extensions import mongo
from app.models.user_model import UserModel
from app.models.room_model import RoomModel

# Create Flask app
app = create_app()

with app.app_context():
    # 1) Drop old data
    mongo.db.users.drop()
    mongo.db.rooms.drop()
    mongo.db.bookings.drop()

    # 2) Seed users
    user_specs = [
        ("admin@hcmut.edu.vn",      "Admin@123",    "admin"),
        ("alice@student.hcmut.edu", "Alice@123",    "student"),
        ("bob@student.hcmut.edu",   "Bob@123",      "student"),
    ]
    for email, pwd, role in user_specs:
        try:
            UserModel.create(email, pwd, role)
            app.logger.info(f"✅ Created {role} account: {email} / {pwd}")
        except ValueError:
            app.logger.info(f"ℹ️ {role.capitalize()} {email} already exists")

    # 3) Seed rooms
    room_specs = [
        ("Private Study 1",     2,  "private",  {"x": 0, "y": 0, "z": 0}),
        ("Private Study 2",     2,  "private",  {"x": 1, "y": 0, "z": 0}),
        ("Private Study 3",     2,  "private",  {"x": 2, "y": 0, "z": 0}),
        ("Group Study A",       6,  "group",    {"x": 0, "y": 1, "z": 1}),
        ("Group Study B",       8,  "group",    {"x": 1, "y": 1, "z": 1}),
        ("Conference Room 100", 12, "conference",{"x": 2, "y": 1, "z": 2}),
    ]
    for name, cap, typ, pos in room_specs:
        rid = RoomModel.create(name, cap, typ, pos)
        app.logger.info(f"✅ Room seeded: '{name}' (id={rid}) at {pos}")

if __name__ == "__main__":
    app.run(port=5000)
