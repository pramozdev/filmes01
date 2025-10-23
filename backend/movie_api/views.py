from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import FavoriteList
from .serializers import FavoriteListSerializer


class FavoriteListCreateView(generics.CreateAPIView):
    queryset = FavoriteList.objects.all()
    serializer_class = FavoriteListSerializer


class FavoriteListListView(generics.ListAPIView):
    queryset = FavoriteList.objects.all().order_by('-created_at')
    serializer_class = FavoriteListSerializer


class FavoriteListDetailView(generics.RetrieveDestroyAPIView):
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
    """
    Salva uma nova lista de favoritos
    """
    print(f"Dados recebidos: {request.data}")
    
    serializer = FavoriteListSerializer(data=request.data)
    if serializer.is_valid():
        try:
            favorite_list = serializer.save()
            print(f"Lista salva com sucesso: {favorite_list.id}")

            favorite_data = FavoriteListSerializer(favorite_list).data

            response_payload = {
                **favorite_data,
                'message': 'Lista salva com sucesso!',
                'share_url': f'/shared/{favorite_list.id}'
            }

            return Response(response_payload, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Erro ao salvar lista: {str(e)}")
            return Response({
                'error': f'Erro interno ao salvar: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        print(f"Erro de validação: {serializer.errors}")
        return Response({
            'error': 'Dados inválidos',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_shared_list(request, list_id):
    """
    Recupera uma lista compartilhada pelo ID
    """
    try:
        favorite_list = get_object_or_404(FavoriteList, id=list_id)
        serializer = FavoriteListSerializer(favorite_list)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Lista não encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )