import json
from re import A
from typing import List
import logging
from models.show import Show
import os
import random

from bs4 import BeautifulSoup
from quart import Quart, render_template, send_from_directory, jsonify, request
import httpx

from utils import retrieve_show, retrieve_id_list

app = Quart(__name__, static_folder="ranime-client/build/static",
            template_folder="ranime-client/build")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
async def index(path):
    return await render_template('index.html')


@app.route("/hello")
async def hello():
    return "hello"


@app.route("/data/anime", methods=["GET", "POST"])
async def random_anime():
    nsfw_url_arg = 0

    if request.method == "POST":
        body = await request.get_json()
        nsfw_url_arg = int(body["nsfw"])

    id_list: List[int] = await retrieve_id_list(nsfw_url_arg, 5)
    chosen_show: Show = await retrieve_show(random.choice(id_list), isAdult=int(nsfw_url_arg))

    return jsonify(chosen_show.to_dict())


@app.route("/data/advanced", methods=["GET", "POST"])
async def random_test():
    nsfw_url_arg = 0
    season = "FALL"
    seasonYear = 2020
    isAdult = ""

    if request.method == "POST":
        body = await request.get_json()
        nsfw_url_arg = int(body.get("nsfw", 0))
        season = body.get("season", season)
        seasonYear = int(body.get("seasonYear", seasonYear))

    if nsfw_url_arg == 0:
        isAdult = " isAdult: false"
    elif nsfw_url_arg == 1:
        isAdult = " isAdult: true"

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

    chosen_show: Show = await retrieve_show(random.choice(id_list))

    return jsonify(chosen_show.to_dict())

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
