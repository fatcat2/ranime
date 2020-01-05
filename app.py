import json
import os
import random

from quart import Quart, render_template, send_from_directory, jsonify
import httpx

app = Quart(__name__, static_folder="ranime-client/build/static", template_folder="ranime-client/build")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
async def index(path):
    return await render_template('index.html')

@app.route("/hello")
async def hello():
    return "hello"

@app.route("/data/anime")
async def random_anime():
    got_result = False
    while not got_result:
        random_id: int = random.randint(1, 10000)
        # print(random_id)
        query = '''
        query ($id: Int) { # Define which variables will be used in the query (id)
        Media (id: $id, type: ANIME, isAdult: false) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            id
            title {
                romaji
                english
                native
            }
            genres
            description
            coverImage {
                extraLarge
            }
            season
            seasonYear
        }
        }
        '''

        variables = {
            'id': random_id
        }

        url = 'https://graphql.anilist.co'
        response = await httpx.post(url, json={'query': query, 'variables': variables})
        result = json.loads(response.text)
        ret_dict = {}
        if result["data"]["Media"] != None:
            # print(result)
            got_result == True
            ret_dict["title"] = result["data"]["Media"]["title"]["english"]
            if ret_dict["title"] == None:
                ret_dict["title"] = result["data"]["Media"]["title"]["romaji"]
            ret_dict["genres"] = result["data"]["Media"]["genres"]
            ret_dict["image"] = result["data"]["Media"]["coverImage"]["extraLarge"]
            ret_dict["description"] = result["data"]["Media"]["description"]
            try:
                ret_dict["aired"] = f"Aired {result['data']['Media']['season'].lower().capitalize()} {result['data']['Media']['seasonYear']}"
            except:
                ret_dict["aired"] = ""
            # print(ret_dict)
            return jsonify(ret_dict)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))