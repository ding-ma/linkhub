import os
from firebase_admin import firestore
from mockfirestore import MockFirestore


def get_env_variable(name):
    try:
        return os.environ.get(name)
    except KeyError:
        message = "Expected environment variable '{}' not set.".format(name)
        raise Exception(message)


def create_db():
    if get_env_variable('DB_SETTING') == 'PROD':
        return firestore.client()
    elif get_env_variable('DB_SETTING') == 'TEST':
        return MockFirestore()
    else:
        raise Exception("Invalid database setting")
