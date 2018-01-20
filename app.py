from flask import Flask, render_template
from pymongo import MongoClient
from bson.json_util import dumps

app = Flask(__name__)

# Credentials for accessing mongodb
MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'cfcdvdb'
COLLECTION_NAME = 'seasons'


# Helper methods for gathering our data from mongodb
def get_seasons():
    '''
    Return a pymongo cursor instance containing the data using our credentials
    '''
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        collection = conn[DBS_NAME][COLLECTION_NAME]
        return collection.find()


def convert_collection_to_json(data):
    '''
    Return the data as a JSON object
    '''
    try:
        data = dumps(list(data))
    except:
        print('{} was not converted to JSON correctly')
        print('data:'.format(data))
        print('data type: '.format(data))
    return data


# Flask app routes
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/cfcdvdv/seasons')
def seasons():
    return convert_collection_to_json(get_seasons())


if __name__ == "__main__":
    app.run(debug=True)