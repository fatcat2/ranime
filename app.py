import json
import os
import random

from quart import Quart, render_template, send_from_directory, jsonify
import httpx

app = Quart(__name__, static_folder="build/static", template_folder="build")

@app.route("/")
async def serve():
    return await render_template("index.html")

@app.route("/hello")
async def hello():
    return "hello"

@app.route("/data/anime")
async def random_anime():
    got_result = False
    while not got_result:
        random_id: int = random.randint(1, 10000)
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
            genres
        }
        }
        '''

        # Define our query variables and values that will be used in the query request
        variables = {
            'id': random_id
        }

        url = 'https://graphql.anilist.co'

        # Make the HTTP Api request
        response = await httpx.post(url, json={'query': query, 'variables': variables})
        result = json.loads(response.text)
        if result["data"]["Media"] != None:
            got_result == True
            r = result["data"]["Media"]["title"]["english"]
            if r == None:
                r = result["data"]["Media"]["title"]["romaji"]
            return jsonify(r)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))