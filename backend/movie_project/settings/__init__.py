# Importar configurações de desenvolvimento por padrão
from .development import *

# Em produção, sobrescrever com as configurações de produção
import os
if os.getenv('ENV') == 'production':
    from .production import *
