import json
import logging
import random
from typing import Any, Dict

from bs4 import BeautifulSoup
import httpx

from models.show import Show

def clean_html(text):
    soup = BeautifulSoup(text, 'html.parser')

    for e in soup.findAll('br'):
        e.extract()
    return soup.text

async def retrieve_show(anime_id: int) -> Show:
    """Helper function to extract show data

    Params:
        result (Dict[str, Any]): The result from a query to the Anilist GraphQL API.
    
    Returns:
        Dict[str, Any]: A dictionary with the data formatted for the React frontend.
    """

    query = '''
    query ($id: Int) {
        Media (id: $id, type: ANIME) {
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
            externalLinks {
                url
                site
            }
        }
    }
    '''

    single_episode_vars = {
        'id': anime_id
    }

    url = "https://graphql.anilist.co:"
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json={'query': query, 'variables': single_episode_vars})
        result = json.loads(response.text)
        await response.aclose()

    ret_dict = {}

    title = result["data"]["Media"]["title"].get([key for key in result["data"]["Media"]["title"]][0])
    genres = result["data"]["Media"]["genres"]
    image = result["data"]["Media"]["coverImage"]["extraLarge"]
    
    watch_link = ""
    watch_site = "No site found"
    aired = ""
    description = ""

    external_sites = result["data"]["Media"]["externalLinks"]

    try:
        description = clean_html(result["data"]["Media"]["description"])
        clean_html(description)
    except:
        logging.error("HTML cleaning error")
        pass

    try:
        aired = f"Aired {result['data']['Media']['season'].lower().capitalize()} {result['data']['Media']['seasonYear']}"
    except:
        pass
    
    return Show(
        anime_id=anime_id,
        genres=genres,
        title=title,
        image=image,
        description=description,
        external_sites=external_sites,
        aired=aired
    )

async def retrieve_id_list(isAdult: int, pages: int) -> Show:
    """Helper function to extract show data

    Params:
        result (Dict[str, Any]): The result from a query to the Anilist GraphQL API.
    
    Returns:
        Dict[str, Any]: A dictionary with the data formatted for the React frontend.
    """
    nsfw_string = ""

    if isAdult == 0:
        nsfw_string = " isAdult: false"
    elif isAdult == 1:
        nsfw_string = " isAdult: true"

    page_query = '''
    query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (type: ANIME''' + nsfw_string + ''') {
                id
            }
        }
    }
    '''

    url = "https://graphql.anilist.co:"
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json={'query': page_query, 'variables': {}})
        result = json.loads(response.text)
        await response.aclose()

    max_page = int(result["data"]["Page"]["pageInfo"]["lastPage"])

    random_pages = [random.choice(range(max_page)) for i in range(pages)]

    
    async with httpx.AsyncClient() as client:
        page_response = await client.post(url, json={'query': page_query, 'variables': {"page": random.choice(random_pages)}})
        page_result = json.loads(page_response.text)
    
    return [entry["id"] for entry in page_result["data"]["Page"]["media"]]