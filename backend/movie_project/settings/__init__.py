from .base import *

# Importar configurações de produção apenas se não estiver em desenvolvimento
if not DEBUG:
    from .production import *
