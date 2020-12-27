from tests.utils import *


def test_create_link_no_body(app, client):
    res = client.post('/link')
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Key needed to create workspace" in msg


def test_create_link_no_workspace(app, client):
    TEST_LINK_1['key'] = "some_key"
    res = client.post('/link', json=TEST_LINK_1, content_type=SEND_JSON)
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Workspace must be created before adding a link" in msg


def test_create_link(app, client):
    TEST_LINK_1['key'] = create_workspace(client)
    res = client.post('/link', json=TEST_LINK_1, content_type=SEND_JSON)
    assert res.status_code == 200


def test_get_link_no_body(app, client):
    res = client.get('/link')
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Key needed to get links from workspace" in msg


def test_get_link_no_workspace(app, client):
    res = client.get('/link', query_string={"key": "somekey"})
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Workspace must be created before getting links" in msg


def test_get_link_empty_workspace(app, client):
    wk = create_workspace(client)
    res = client.get('/link', query_string={"key": wk})
    msg = byte_to_dict(res.data)
    assert res.status_code == 200 and not msg['links']


def test_get_link(app, client):
    wk = create_workspace(client)
    TEST_LINK_1['key'] = wk
    create_link(client, TEST_LINK_1)
    res = client.get('/link', query_string={"key": wk})
    msg = byte_to_dict(res.data)
    assert res.status_code == 200 and len(msg['links']) == 1 and assert_key_in_list("LINK_ONE", msg['links'])


def test_get_two_links(app, client):
    wk = create_workspace(client)
    TEST_LINK_1['key'] = wk
    create_link(client, TEST_LINK_1)
    
    TEST_LINK_2['key'] = wk
    create_link(client, TEST_LINK_2)
    
    res = client.get('/link', query_string={"key": wk})
    msg = byte_to_dict(res.data)
    assert res.status_code == 200 and len(msg['links']) == 2 and \
           assert_key_in_list("LINK_ONE", msg['links']) and assert_key_in_list("LINK_TWO", msg['links'])


def test_update_link_no_body(app, client):
    res = client.put('/link')
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Key and docID are needed to update link" in msg


def test_update_link_no_workspace(app, client):
    UPDATE_LINK_1['key'] = "somekey"
    UPDATE_LINK_1['docID'] = "someid"
    res = client.put('/link', json=UPDATE_LINK_1, content_type=SEND_JSON)
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Workspace must be created before updating a link" in msg


def test_update_link(app, client):
    wk = create_workspace(client)
    TEST_LINK_1['key'] = wk
    UPDATE_LINK_1['docID'] = create_link(client, TEST_LINK_1)
    UPDATE_LINK_1['key'] = wk
    
    res = client.put('/link', json=UPDATE_LINK_1, content_type=SEND_JSON)
    assert res.status_code == 200
    
    res = client.get('/link', query_string={"key": wk})
    msg = byte_to_dict(res.data)
    assert assert_key_in_list("NEW_LINK_ONE", msg['links']) and res.status_code == 200


def test_delete_link_no_body(app, client):
    res = client.delete('/link')
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Key and docID are needed to delete link" in msg


def test_delete_link_no_workspace(app, client):
    res = client.delete('/link', json={"key": "somekey", "docID": "someid"}, content_type=SEND_JSON)
    msg = byte_to_string(res.data)
    assert res.status_code == 400 and "Workspace must be created before deleting a link" in msg


def test_delete_link(app, client):
    wk = create_workspace(client)
    TEST_LINK_1['key'] = wk
    doc_id = create_link(client, TEST_LINK_1)
    
    res = client.delete('/link', json={"key": wk, "docID": doc_id}, content_type=SEND_JSON)
    assert res.status_code == 200
    
    res = client.get('/link', query_string={"key": wk})
    msg = byte_to_dict(res.data)
    assert res.status_code == 200 and not msg['links']
