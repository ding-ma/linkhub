from flask import Flask, request, jsonify
import secrets

import firebase_admin
from firebase_admin import credentials
from config import create_db
from dotenv import load_dotenv

load_dotenv('.env')
cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)
db = create_db()
app = Flask(__name__)


@app.route('/workspace', methods=['POST'])
def create_workspace():
    data = request.get_json()
    if not data or "pwd" not in data or "name" not in data:
        return "Password and name needed to create a new workspace", 400
    
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
    pwd = key.document('init').get().to_dict()['pwd']
    if pwd != data['pwd']:
        return "Incorrect password", 403
    
    delete_collection(key, 10)
    return '', 200


@app.route('/link', methods=['GET'])
def get_all_link():
    data = request.get_json()
    if not data or "key" not in data:
        return "Key needed to get links from workspace", 400
    
    docs = db.collection(data['key'])
    if not docs.document('init').get().exists:
        return "Workspace must be created before getting links", 400
    
    links = []
    return_json = {}
    for doc in docs.stream():
        if doc.id == "init":
            return_json['workplace'] = doc.to_dict()['name']
            continue
        
        d = doc.to_dict()
        d['docID'] = doc.id
        links.append(d)
    
    return_json['links'] = links
    return jsonify(return_json), 200


@app.route('/link', methods=['POST'])
def create_link():
    data = request.get_json()
    if not data or "key" not in data:
        return "Key needed to delete workspace", 400

    wk = db.collection(data['key'])
    if not wk.document('init').get().exists:
        return "Workspace must be created before adding a link", 400

    wk.document().set(data['link'])
    return '', 200


@app.route('/link', methods=['PUT'])
def update_link():
    data = request.get_json()
    if not data or "key" not in data or "docID" not in data:
        return "Key and docID are needed to update link", 400

    wk = db.collection(data['key'])
    if not wk.document('init').get().exists:
        return "Workspace must be created before updating a link", 400

    wk.document(data['docID']).set(data['update'])
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
    app.run(debug=True)
