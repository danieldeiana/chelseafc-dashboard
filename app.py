from flask import Flask, render_template
from pymongo import MongoClient
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'cfcdvdb'
COLLECTION_NAME = 'seasons'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/cfcdvdv/seasons')
def seasons():
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        seasons = collection.find()
        return dumps(list(seasons))


if __name__ == "__main__":
    app.run(debug=True)