from tests.utils import *


def test_create_workspace_no_body(app, client):
    res = client.post('/workspace')
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Password and name needed to create a new workspace" in msg


def test_create_workspace(app, client):
    res = client.post('/workspace', json=TEST_WORKSPACE, content_type=SEND_JSON)
    json = byte_to_dict(res.data)
    assert res.status_code == 200 and "key" in json


def test_delete_workspace_no_pwd(app, client):
    res = client.delete('/workspace')
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Password and key needed to delete workspace" in msg


def test_delete_workspace_wrong_pwd(app, client):
    key = create_workspace(client)
    res = client.delete('/workspace', json={"key": key, "pwd": "aaa"}, content_type=SEND_JSON)
    assert res.status_code == 403


def test_not_exist_workspace(app, client):
    res = client.delete('/workspace', json={"key": "some_key", "pwd": "aaa"}, content_type=SEND_JSON)
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "This workspace does not exist" in msg


def test_delete_workspace(app, client):
    key = create_workspace(client)
    res = client.delete('/workspace', json={"key": key, "pwd": TEST_WORKSPACE['pwd']}, content_type=SEND_JSON)
    assert res.status_code == 200
    
    res = client.delete('/workspace', json={"key": key, "pwd": TEST_WORKSPACE['pwd']}, content_type=SEND_JSON)
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "This workspace does not exist" in msg
