from flask import Flask, request, Response, jsonify
import secrets

import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
app = Flask(__name__)


@app.route('/workspace', methods=['POST'])
def create_workspace():
    data = request.get_json()
    if not data or "pwd" not in data:
        return Response("Password needed to create a new workspace", status=400)
    
    unique_id = secrets.token_urlsafe(8)
    env = db.collection(unique_id)
    env.document("init").set(data)
    return Response(unique_id, status=200)


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
    if not data or "pwd" not in data or "env" not in data:
        return Response("Password and key needed to delete workspace", status=400)
    
    env = db.collection(data['env'])
    pwd = env.document('init').get().to_dict()['pwd']
    if pwd != data['pwd']:
        return Response("Incorrect password", status=403)
    delete_collection(env, 10)
    return Response(status=200)


@app.route('/link', methods=['GET'])
def get_all_link():
    pass


@app.route('/link', methods=['POST'])
def create_link():
    pass


@app.route('/link', methods=['PUT'])
def update_link():
    pass


@app.route('/link', methods=['DELETE'])
def delete_link():
    pass


if __name__ == '__main__':
    app.run(debug=True)
