from django.db import models
import uuid
import json


class FavoriteList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, default='Minha Lista de Favoritos')
    movies = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({len(self.movies)} filmes)"

    class Meta:
        ordering = ['-created_at']