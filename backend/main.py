from flask import Flask, request, jsonify
import secrets
from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials
from config import create_db
from dotenv import load_dotenv
import os

load_dotenv('.env')
cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)
db = create_db()
app = Flask(__name__)
CORS(app)

# TODO: PUT/workspace -> allow modify workspace name
# TODO: GET/workspace -> get workspace name (simplifies api calls)


@app.route('/workspace', methods=['POST'])
def create_workspace():
    data = request.get_json()
    if not data or "pwd" not in data or "name" not in data:
        return "Password and name needed to create a new workspace", 400
    
    if not data["pwd"] or not data["name"]:
        return "Password or name can't be empty", 400
    
    unique_id = secrets.token_urlsafe(8)
    wk = db.collection(unique_id)
    wk.document("init").set(data)
    return jsonify({'key': unique_id}), 200


def delete_collection(coll_ref, batch_size):
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0
    
    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1
    
    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)


@app.route('/workspace', methods=['DELETE'])
def delete_workspace():
    data = request.get_json()
    if not data or "pwd" not in data or "key" not in data:
        return "Password and key needed to delete workspace", 400
    
    key = db.collection(data['key'])
    
    if not key.document('init').get().exists:
        return "This workspace does not exist", 400
    
    pwd = key.document('init').get().to_dict()['pwd']
    if pwd != data['pwd']:
        return "Incorrect password", 403
    
    delete_collection(key, 10)
    return '', 200


@app.route('/workspace', methods=['GET'])
def get_workspace_name():
    key = request.args.get('key')
    if not key:
        return "Key needed to get workspace name", 400
    docs = db.collection(key)
    init = docs.document('init').get()
    if not init.exists:
        return "Workspace must be created first", 400
    
    return {'name': init.to_dict()['name']}, 200


@app.route('/workspace', methods=['PUT'])
def change_workspace_name():
    data = request.get_json()
    print(data)
    if not data or "pwd" not in data or "key" not in data or "name" not in data:
        return "Password, key, and name needed to change workspace name", 400
    
    key = db.collection(data['key'])
    if not key.document('init').get().exists:
        return "This workspace does not exist", 400

    key.document('init').update({'name': data['name']})
    return '', 200


@app.route('/link', methods=['GET'])
def get_all_link():
    key = request.args.get('key')
    if not key:
        return "Key needed to get links from workspace", 400
    
    docs = db.collection(key)
    if not docs.document('init').get().exists:
        return "Workspace must be created before getting links", 400
    
    links = []
    return_json = {}
    for doc in docs.stream():
        if doc.id == "init":
            continue
        
        d = {'docID': doc.id}
        for k, v in doc.to_dict().items():
            d[k] = v
        
        links.append(d)
    
    return_json['links'] = links
    return jsonify(return_json), 200


@app.route('/link', methods=['POST'])
def create_link():
    data = request.get_json()
    if not data or "key" not in data or "link" not in data or "name" not in data:
        return "Key needed to create workspace", 400
    
    wk = db.collection(data['key'])
    if not wk.document('init').get().exists:
        return "Workspace must be created before adding a link", 400
    
    link_id = wk.document()
    link_id.set({"name": data['name'], "link": data['link']})
    return jsonify({"docID": link_id.id}), 200


@app.route('/link', methods=['PUT'])
def update_link():
    data = request.get_json()
    if not data or "key" not in data or "docID" not in data or "link" not in data or "name" not in data:
        return "Key and docID are needed to update link", 400
    
    wk = db.collection(data['key'])
    if not wk.document('init').get().exists:
        return "Workspace must be created before updating a link", 400
    
    wk.document(data['docID']).set({"name": data['name'], "link": data['link']})
    return '', 200


@app.route('/link', methods=['DELETE'])
def delete_link():
    data = request.get_json()
    if not data or "key" not in data or "docID" not in data:
        return "Key and docID are needed to delete link", 400
    
    wk = db.collection(data['key'])
    if not wk.document('init').get().exists:
        return "Workspace must be created before deleting a link", 400
    
    wk.document(data['docID']).delete()
    return '', 200


if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5555)))
