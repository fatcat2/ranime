import json
import os
import random

from quart import Quart, render_template, send_from_directory
import requests

app = Quart(__name__, static_folder="build/static", template_folder="build")

@app.route("/")
def serve():
    return render_template("index.html")

@app.route("/hello")
def hello():
    return "hello"

@app.route("/data/anime")
def random_anime():
    random_id: int = random.randint(1, 800)
    print(random_id)
    query = '''
    query ($id: Int) { # Define which variables will be used in the query (id)
    Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
        id
        title {
        romaji
        english
        native
        }
    }
    }
    '''

    # Define our query variables and values that will be used in the query request
    variables = {
        'id': random_id
    }

    url = 'https://graphql.anilist.co'

    # Make the HTTP Api request
    response = requests.post(url, json={'query': query, 'variables': variables})
    return json.loads(response.text)["data"]["Media"]["title"]["english"]

app.run()