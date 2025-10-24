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
    queryset = FavoriteList.objects.all().order_by('-created_at')
    serializer_class = FavoriteListSerializer


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
    serializer = FavoriteListSerializer(data=request.data)
    if serializer.is_valid():
        try:
            favorite_list = serializer.save()
            favorite_data = FavoriteListSerializer(favorite_list).data

            response_payload = {
                **favorite_data,
                'message': 'Lista salva com sucesso!',
                'share_url': f'/shared/{favorite_list.id}'
            }

            logger.info("Lista de favoritos salva", extra={"favorite_list_id": str(favorite_list.id)})
            return Response(response_payload, status=status.HTTP_201_CREATED)
        except Exception:
            logger.exception("Erro interno ao salvar lista de favoritos")
            return Response(
                {'error': 'Erro interno ao salvar'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        logger.warning(
            "Erro de validação ao salvar lista de favoritos",
            extra={"errors": serializer.errors}
        )
        return Response(
            {'error': 'Dados inválidos', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def get_shared_list(request, list_id):
    """Retorna os dados de uma lista compartilhada via link público."""
    favorite_list = get_object_or_404(FavoriteList, id=list_id)
    serializer = FavoriteListSerializer(favorite_list)
    return Response(serializer.data)