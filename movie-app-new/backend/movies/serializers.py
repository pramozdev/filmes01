from rest_framework import serializers
from .models import FavoriteList


class FavoriteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteList
        fields = ['id', 'name', 'movies', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_movies(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Movies deve ser uma lista.")
        
        for i, movie in enumerate(value):
            if not isinstance(movie, dict):
                raise serializers.ValidationError(f"Filme {i+1} deve ser um objeto.")
            
            # Campos obrigatórios mínimos
            required_fields = ['id', 'title']
            for field in required_fields:
                if field not in movie:
                    raise serializers.ValidationError(f"Filme {i+1}: Campo '{field}' é obrigatório.")
        
        return value
