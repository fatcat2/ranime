import json
import os
import random

from bs4 import BeautifulSoup
from quart import Quart, render_template, send_from_directory, jsonify, request
import httpx


app = Quart(__name__, static_folder="ranime-client/build/static", template_folder="ranime-client/build")

def clean_html(text):
    soup = BeautifulSoup(text, 'html.parser')

    for e in soup.findAll('br'):
        e.extract()
    # print(soup.text)
    return soup.text


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

    if nsfw_url_arg == 0:
        isAdult = " isAdult: false"
    elif nsfw_url_arg == 1:
        isAdult = " isAdult: true"
    else:
        isAdult = ""

    got_result = False

    while not got_result:
        random_id: int = random.randint(1, 10000)
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
            got_result == True
            ret_dict["title"] = result["data"]["Media"]["title"]["english"]
            if ret_dict["title"] == None:
                ret_dict["title"] = result["data"]["Media"]["title"]["romaji"]
            ret_dict["genres"] = result["data"]["Media"]["genres"]
            ret_dict["image"] = result["data"]["Media"]["coverImage"]["extraLarge"]
            ret_dict["description"] = clean_html(result["data"]["Media"]["description"])
            try:
                clean_html(ret_dict["description"])
            except:
                pass
            try:
                ret_dict["aired"] = f"Aired {result['data']['Media']['season'].lower().capitalize()} {result['data']['Media']['seasonYear']}"
            except:
                ret_dict["aired"] = ""
            return jsonify(ret_dict)


@app.route("/data/test", methods=["GET", "POST"])
async def random_test():
    if request.method == "GET":
        nsfw_url_arg = 0
        season = "FALL"
        seasonYear = 2020
    else:
        body = await request.get_json()
        nsfw_url_arg =int(body["nsfw"])
        season = body["season"]
        seasonYear = int(body["seasonYear"])

    if nsfw_url_arg == 0:
        isAdult = " isAdult: false"
    elif nsfw_url_arg == 1:
        isAdult = " isAdult: true"
    else:
        isAdult = ""

    season_query = '''
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (season: $season, seasonYear: $seasonYear, type: ANIME''' + isAdult + ''') {
                id
                season
                seasonYear
            }
        }
    }
    '''

    next_page = False
    page_counter = 0

    id_list = []

    while not next_page:

        variables = {
            "page": page_counter,
            "perPage": 100,
            "season": season,
            "seasonYear": seasonYear
        }

        url = 'https://graphql.anilist.co'
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={'query': season_query, 'variables': variables})
            result = json.loads(response.text)

        id_list += [media["id"] for media in result["data"]["Page"]["media"]]

        if result["data"]["Page"]["pageInfo"]["hasNextPage"] == False:
            break
        
        page_counter += 1

    the_chosen_one = random.choice(id_list)
    
    query = '''
    query ($id: Int) {
        Media (id: $id, type: ANIME''' + isAdult + ''') {
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
            streamingEpisodes {
                url
                site
            }
        }
    }
    '''

    single_episode_vars = {
        "id": the_chosen_one
    }

    url = 'https://graphql.anilist.co'
    async with httpx.AsyncClient() as client:
            response = await client.post(url, json={'query': query, 'variables': single_episode_vars})
            result = json.loads(response.text)

    ret_dict = {}

    ret_dict["title"] = result["data"]["Media"]["title"]["english"]

    if ret_dict["title"] == None:
        ret_dict["title"] = result["data"]["Media"]["title"]["romaji"]
    ret_dict["genres"] = result["data"]["Media"]["genres"]
    ret_dict["image"] = result["data"]["Media"]["coverImage"]["extraLarge"]
    ret_dict["description"] = clean_html(result["data"]["Media"]["description"])

    if len(result["data"]["Media"]["streamingEpisodes"]) > 0:
        ret_dict["watch_link"] = result["data"]["Media"]["streamingEpisodes"][0]["url"]
        ret_dict["watch_site"] = result["data"]["Media"]["streamingEpisodes"][0]["site"]
    else:
        ret_dict["watch_link"] = ""
        ret_dict["watch_site"] = ""

    try:
        clean_html(ret_dict["description"])
    except:
        pass
    try:
        ret_dict["aired"] = f"Aired {result['data']['Media']['season'].lower().capitalize()} {result['data']['Media']['seasonYear']}"
    except:
        ret_dict["aired"] = ""

    return jsonify(ret_dict)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))