import ast


def byte_to_json(b):
    return ast.literal_eval(b.decode("UTF-8"))


def test_create_workspace_no_body(app, client):
    res = client.post('/workspace')
    assert res.status_code == 400


def test_create_workspace(app, client):
    res = client.post('/workspace', json={'pwd': '123', 'name': 'tester'}, content_type="application/json")
    json = byte_to_json(res.data)
    assert res.status_code == 200 and "key" in json
