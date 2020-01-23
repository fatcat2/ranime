import json
import os
import random

from quart import Quart, render_template, send_from_directory, jsonify, request
import httpx

app = Quart(__name__, static_folder="ranime-client/build/static", template_folder="ranime-client/build")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
async def index(path):
    return await render_template('index.html')

@app.route("/hello")
async def hello():
    return "hello"

@app.route("/data/anime", methods=["GET", "POST"])
async def random_anime():
    if request.method == "GET":
        nsfw_url_arg = 0
    else:
        nsfw_url_arg = await request.get_json()
        nsfw_url_arg =int(nsfw_url_arg["nsfw"])
        print(nsfw_url_arg)

    if nsfw_url_arg == 0:
        isAdult = " isAdult: false"
    elif nsfw_url_arg == 1:
        isAdult = " isAdult: true"
    else:
        isAdult = ""

    got_result = False

    while not got_result:
        random_id: int = random.randint(1, 10000)
        # print(random_id)
        query = '''
        query ($id: Int) {
            Media (id: $id, type: ANIME''' + isAdult + ''') { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
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

        # print(query)

        variables = {
            'id': random_id
        }

        url = 'https://graphql.anilist.co'
        client = httpx.AsyncClient()
        response = await client.post(url, json={'query': query, 'variables': variables})
        await client.aclose()
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