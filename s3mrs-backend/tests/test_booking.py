def test_register_login(client):
    rv = client.post("/api/auth/register", json={
        "email": "a@b.com",
        "password": "123456"
    })
    assert rv.status_code == 201

    rv = client.post("/api/auth/login", json={
        "email": "a@b.com",
        "password": "123456"
    })
    assert rv.status_code == 200
    assert "access_token" in rv.get_json()
