from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FavoriteList
from .serializers import FavoriteListSerializer


class FavoriteListSerializerTests(APITestCase):
    def test_serializer_validates_movies_payload(self):
        data = {
            'name': 'Lista Teste',
            'movies': [
                {
                    'id': 1,
                    'title': 'Filme Exemplo',
                    'poster_path': '/poster.jpg',
                    'overview': 'Um filme qualquer',
                    'vote_average': 8.2,
                }
            ],
        }

        serializer = FavoriteListSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_rejects_invalid_movies_structure(self):
        serializer = FavoriteListSerializer(data={'name': 'Teste', 'movies': ['um filme']})
        self.assertFalse(serializer.is_valid())
        self.assertIn('movies', serializer.errors)


class SaveFavoritesViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('save_favorites')
        self.valid_payload = {
            'name': 'Minha Lista',
            'movies': [
                {
                    'id': 123,
                    'title': 'Matrix',
                    'poster_path': '/matrix.jpg',
                    'overview': 'Filme de ficção científica',
                    'vote_average': 8.5,
                }
            ],
        }

    def test_create_favorite_list_success(self):
        response = self.client.post(self.url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FavoriteList.objects.count(), 1)
        favorite = FavoriteList.objects.first()
        self.assertEqual(str(favorite.id), response.data['id'])
        self.assertIn('share_url', response.data)

    def test_create_favorite_list_invalid_payload(self):
        response = self.client.post(self.url, {'name': 'Sem filmes', 'movies': []}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(FavoriteList.objects.count(), 0)
