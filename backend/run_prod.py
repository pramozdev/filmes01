from waitress import serve
from movie_project.wsgi import application
import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Usa a porta do ambiente ou 5000 como padrão
    print(f"Iniciando servidor na porta {port}...")
    print(f"Acesse em: http://localhost:{port}/")
    serve(application, host='0.0.0.0', port=port)