from flask import Flask
import secrets

app = Flask(__name__)


@app.route('/')
def create():
    return secrets.token_urlsafe(8)


if __name__ == '__main__':
    app.run( debug=True)
