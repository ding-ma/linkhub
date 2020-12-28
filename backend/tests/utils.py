import json

TEST_WORKSPACE = {'pwd': '123', 'name': 'tester'}
TEST_LINK_1 = {
    
    "link": "https://www.youtube.com/",
    "name": "yt link"
    
}
UPDATE_LINK_1 = {
    "name": "NEW_LINK_ONE",
    "link": "https://www.facebook.com/"
}

TEST_LINK_2 = {
    "link": "https://www.google.ca/",
    "name": "gg link"
}
UPDATE_LINK_2 = {
    "name": "NEW_LINK_ONE",
    "link": "http://ssense.com/"
}

SEND_JSON = "application/json"


def byte_to_dict(b):
    return json.loads(byte_to_string(b))


def byte_to_string(b):
    return b.decode("UTF-8")


def create_workspace(client):
    res = client.post('/workspace', json=TEST_WORKSPACE, content_type="application/json")
    json = byte_to_dict(res.data)
    assert "key" in json and res.status_code == 200
    return json['key']


def create_link(client, link):
    res = client.post('/link', json=link, content_type=SEND_JSON)
    assert res.status_code == 200
    return byte_to_dict(res.data)['docID']


def assert_key_in_list(val, lst):
    for e in lst:
        if val in e.values():
            return True
    
    return False
