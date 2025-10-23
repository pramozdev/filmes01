from django.urls import path
from . import views

urlpatterns = [
    path('save/', views.save_favorites, name='save_favorites'),
    path('shared/<uuid:list_id>/', views.get_shared_list, name='get_shared_list'),
    path('create/', views.FavoriteListCreateView.as_view(), name='create_favorite_list'),
    path('lists/', views.FavoriteListListView.as_view(), name='favorite_list_list'),
    path('<uuid:id>/', views.FavoriteListDetailView.as_view(), name='favorite_list_detail'),
]
