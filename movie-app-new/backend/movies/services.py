import requests
from django.conf import settings


class TMDBService:
    def __init__(self):
        self.api_key = '3e831d4c034a4ca7c81640da93ee7764'
        self.base_url = 'https://api.themoviedb.org/3'
        
    def search_movies(self, query, page=1):
        """Buscar filmes por query"""
        url = f"{self.base_url}/search/movie"
        params = {
            'api_key': self.api_key,
            'query': query,
            'page': page,
            'language': 'pt-BR',
            'include_adult': False
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Erro ao buscar filmes: {str(e)}")
    
    def get_popular_movies(self, page=1):
        """Buscar filmes populares"""
        url = f"{self.base_url}/movie/popular"
        params = {
            'api_key': self.api_key,
            'page': page,
            'language': 'pt-BR'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Erro ao buscar filmes populares: {str(e)}")
    
    def get_movie_details(self, movie_id):
        """Buscar detalhes de um filme específico"""
        url = f"{self.base_url}/movie/{movie_id}"
        params = {
            'api_key': self.api_key,
            'language': 'pt-BR'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Erro ao buscar detalhes do filme: {str(e)}")
    
    def get_image_url(self, path, size='w500'):
        """Formatar URL da imagem"""
        if not path:
            return 'https://via.placeholder.com/500x750?text=No+Image'
        return f"https://image.tmdb.org/t/p/{size}{path}"


# Instância global do serviço
tmdb_service = TMDBService()
