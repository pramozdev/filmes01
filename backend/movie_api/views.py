import logging

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import FavoriteList
from .serializers import FavoriteListSerializer


logger = logging.getLogger(__name__)


class FavoriteListCreateView(generics.CreateAPIView):
    """Endpoint responsável por criar uma nova lista de favoritos."""
    queryset = FavoriteList.objects.all()
    serializer_class = FavoriteListSerializer


class FavoriteListListView(generics.ListAPIView):
    """Lista todas as listas de favoritos cadastradas, da mais recente para a mais antiga."""
    serializer_class = FavoriteListSerializer
    
    def get_queryset(self):
        try:
            logger.info("Listando todas as listas de favoritos")
            queryset = FavoriteList.objects.all().order_by('-created_at')
            logger.info(f"Encontradas {queryset.count()} listas")
            return queryset
        except Exception as e:
            logger.error(f"Erro ao buscar listas de favoritos: {str(e)}", exc_info=True)
            # Retorna um queryset vazio em caso de erro
            return FavoriteList.objects.none()
    
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            # Adiciona metadados úteis na resposta
            response_data = {
                'count': len(serializer.data),
                'results': serializer.data,
                'status': 'success'
            }
            
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Erro ao processar requisição de listagem: {str(e)}", exc_info=True)
            return Response(
                {
                    'status': 'error',
                    'message': 'Ocorreu um erro ao buscar as listas de favoritos',
                    'details': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FavoriteListDetailView(generics.RetrieveDestroyAPIView):
    """Permite consultar ou remover uma lista específica pelo UUID."""
    queryset = FavoriteList.objects.all()
    serializer_class = FavoriteListSerializer
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        favorite_list = self.get_object()
        list_id = str(favorite_list.id)
        self.perform_destroy(favorite_list)
        return Response({
            'message': 'Lista excluída com sucesso!',
            'id': list_id
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
def save_favorites(request):
    """Recebe os dados do frontend e persiste uma nova lista de favoritos."""
    logger.info("Recebendo requisição para salvar lista", extra={"data": request.data})
    
    try:
        # Verifica se os dados são válidos
        if not request.data:
            logger.error("Nenhum dado recebido na requisição")
            return Response(
                {'status': 'error', 'message': 'Nenhum dado recebido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Adiciona valores padrão se não fornecidos
        data = request.data.copy()
        if not isinstance(data, dict):
            try:
                data = dict(data)
            except (TypeError, ValueError) as e:
                logger.error(f"Erro ao converter dados: {str(e)}", exc_info=True)
                return Response(
                    {'status': 'error', 'message': 'Formato de dados inválido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Adiciona nome padrão se não fornecido
        if 'name' not in data or not data['name']:
            data['name'] = 'Minha Lista de Filmes'
        
        # Garante que movies é uma lista
        if 'movies' not in data or not isinstance(data.get('movies'), list):
            data['movies'] = []
        
        # Filtra filmes inválidos
        data['movies'] = [
            movie for movie in data['movies'] 
            if isinstance(movie, dict) and 'id' in movie and 'title' in movie
        ]
        
        logger.info("Dados processados para salvar", extra={
            "list_name": data.get('name'),
            "movie_count": len(data.get('movies', [])),
            "first_movie": data.get('movies', [{}])[0] if data.get('movies') else None
        })
        
        # Valida os dados com o serializer
        serializer = FavoriteListSerializer(data=data)
        
        if serializer.is_valid():
            try:
                # Salva a lista de favoritos
                favorite_list = serializer.save()
                favorite_data = FavoriteListSerializer(favorite_list).data

                # Prepara a resposta de sucesso
                response_payload = {
                    'status': 'success',
                    'data': favorite_data,
                    'message': 'Lista salva com sucesso!',
                    'share_url': f'/shared/{favorite_list.id}'
                }

                logger.info(
                    "Lista de favoritos salva com sucesso",
                    extra={
                        "favorite_list_id": str(favorite_list.id),
                        "list_name": favorite_list.name,
                        "movie_count": len(favorite_list.movies) if favorite_list.movies else 0
                    }
                )
                
                return Response(response_payload, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                error_msg = f"Erro ao salvar lista de favoritos: {str(e)}"
                logger.error(error_msg, exc_info=True)
                return Response(
                    {
                        'status': 'error',
                        'message': 'Erro ao salvar a lista de favoritos',
                        'error': str(e)
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            error_msg = f"Dados inválidos no serializer: {serializer.errors}"
            logger.error(error_msg, extra={"errors": serializer.errors})
            return Response(
                {
                    'status': 'error',
                    'message': 'Dados inválidos',
                    'errors': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        error_msg = f"Erro inesperado ao processar requisição: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return Response(
            {'error': 'Erro inesperado ao processar a requisição', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_shared_list(request, list_id):
    """Retorna os dados de uma lista compartilhada via link público."""
    favorite_list = get_object_or_404(FavoriteList, id=list_id)
    serializer = FavoriteListSerializer(favorite_list)
    return Response(serializer.data)