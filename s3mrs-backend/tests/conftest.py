import pytest, os
from app import create_app

@pytest.fixture()
def app():
    os.environ["MONGO_URI"] = "mongodb://localhost:27017/s3mrs_test"
    os.environ["JWT_SECRET_KEY"] = "12345"
    application = create_app()
    application.testing = True
    yield application
