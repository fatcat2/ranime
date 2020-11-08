from typing import Any, Dict, List


class Show:
    def __init__(
        self,
        title: str = None,
        genres: List[str] = None,
        image: str = None,
        description: str = None,
        external_sites: List[Dict[str, str]] = None,
        aired: str = None,
        anime_id: int = None
    ):
        self.title = title
        self.genres = genres
        self.image = image
        self.description = description
        self.external_sites = external_sites
        self.aired = aired
        self.id = anime_id

    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "id": self.id,
            "genres": self.genres,
            "image": self.image,
            "description": self.description,
            "external_links": self.external_sites,
            "aired": self.aired
        }