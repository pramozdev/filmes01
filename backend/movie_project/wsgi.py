"""
WSGI config for movie_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Configuração para produção
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings.production')
# Garantir que estamos em ambiente de produção
os.environ['ENV'] = 'production'

application = get_wsgi_application()
