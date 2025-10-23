from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import FavoriteList
from .serializers import FavoriteListSerializer
from .services import tmdb_service


@api_view(['GET'])
def search_movies(request):
    """Buscar filmes usando TMDb API"""
    query = request.GET.get('query', '')
    page = int(request.GET.get('page', 1))
    
    if not query:
        return Response({'error': 'Query é obrigatória'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        data = tmdb_service.search_movies(query, page)
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_popular_movies(request):
    """Buscar filmes populares"""
    page = int(request.GET.get('page', 1))
    
    try:
        data = tmdb_service.get_popular_movies(page)
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_movie_details(request, movie_id):
    """Buscar detalhes de um filme específico"""
    try:
        data = tmdb_service.get_movie_details(movie_id)
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def save_favorites(request):
    """Salvar lista de favoritos"""
    serializer = FavoriteListSerializer(data=request.data)
    if serializer.is_valid():
        try:
            favorite_list = serializer.save()
            return Response({
                'id': favorite_list.id,
                'message': 'Lista salva com sucesso!',
                'share_url': f'/shared/{favorite_list.id}'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': f'Erro interno ao salvar: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({
            'error': 'Dados inválidos',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_shared_list(request, list_id):
    """Buscar lista compartilhada"""
    try:
        favorite_list = get_object_or_404(FavoriteList, id=list_id)
        serializer = FavoriteListSerializer(favorite_list)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Lista não encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def get_all_favorites(request):
    """Buscar todas as listas de favoritos"""
    try:
        favorites = FavoriteList.objects.all()
        serializer = FavoriteListSerializer(favorites, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Erro ao buscar listas'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )