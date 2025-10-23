from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search_movies, name='search_movies'),
    path('popular/', views.get_popular_movies, name='get_popular_movies'),
    path('movie/<int:movie_id>/', views.get_movie_details, name='get_movie_details'),
    path('favorites/save/', views.save_favorites, name='save_favorites'),
    path('favorites/shared/<uuid:list_id>/', views.get_shared_list, name='get_shared_list'),
    path('favorites/all/', views.get_all_favorites, name='get_all_favorites'),
]
