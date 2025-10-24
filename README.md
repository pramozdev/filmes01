# 🎬 Movie Favorites Manager

Aplicação full stack para pesquisar filmes na TMDb, montar múltiplas listas de favoritos e compartilhá-las. O frontend foi construído com React + Vite e o backend com Django + Django REST Framework.

## 🧭 Visão Geral

- **Frontend**: React 18, React Router, Axios e CSS modular com tema futurista/responsivo.
- **Backend**: Django 4.2 + DRF, banco SQLite, UUID para listas e JSONField para filmes.
- **Integração**: API TMDb para catálogo e endpoints próprios para persistência/compartilhamento de listas.

## 🎯 Principais Funcionalidades

### Interface Web
- Buscar filmes na TMDb com resultados ricos (poster, nota, sinopse).
- Favoritar/desfavoritar com feedback imediato e persistência local.
- Salvar listas nomeadas no backend, gerar link e copiar automaticamente.
- Exibir todas as listas salvas, selecionar uma para visualização e excluir quando desejado.
- Página dedicada a listas compartilhadas via link público.

### API Backend
- Endpoints REST para criar, listar, detalhar e excluir listas de favoritos.
- Respostas normalizadas com UUID, nome, timestamp, filmes e URL de compartilhamento.
- Tratamento de erros com mensagens claras para o frontend.

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- Python 3.11+
- (Opcional) Ambiente virtual para o backend

### 1. Backend (Django)
```bash
cd backend
python -m venv venv  # opcional
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env  # ou copie manualmente e informe a DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver 9000
```
O backend sobe em `http://localhost:9000`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run lint  # conferindo lint
npm run dev
```
O frontend roda em `http://localhost:5173`.

### 3. Scripts Rápidos (Windows)
- `start-backend.bat` inicia o servidor Django.
- `start-frontend.bat` inicia o Vite.

## 🔑 Configurar TMDb

1. Crie uma chave da API em [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
2. Copie `frontend/env.example` para `frontend/.env`.
3. Defina `VITE_TMDB_API_KEY=<sua_chave>`.
4. Sem essa chave as requisições para a TMDb serão bloqueadas e mensagens de aviso serão exibidas no console do navegador.

## ☁️ Publicar em Produção

### Frontend na Vercel
1. Conecte o repositório e selecione a pasta `frontend`.
2. Configure os comandos padrões: `npm install` e `npm run build` (output `dist`).
3. Defina as variáveis de ambiente:
   - `VITE_TMDB_API_KEY=<sua_chave_da_tmdb>`
   - (Opcional) `VITE_API_BASE_URL=https://seu-backend/api`
4. Faça o deploy e copie a URL pública gerada.

### Backend (Django + DRF)
Hospede em serviços como Render, Railway ou Fly.io:
1. Aponte a raiz para `backend/` e configure o build `pip install -r requirements.txt`.
2. Configure o comando de start `gunicorn movie_project.wsgi`.
3. Defina variáveis de ambiente:
   - `DJANGO_SECRET_KEY`
   - Variáveis de banco (PostgreSQL recomendado)
   - `CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app`
4. Rode `python manage.py migrate` e, se necessário, `collectstatic`.
5. Atualize o frontend com a URL pública do backend.

## 🔗 Endpoints Principais

| Método | Rota                | Descrição                                 |
|--------|---------------------|--------------------------------------------|
| POST   | `/api/save/`        | Salva uma nova lista de favoritos e retorna a lista completa, incluindo link de compartilhamento |
| GET    | `/api/lists/`       | Retorna todas as listas salvas ordenadas do mais recente ao antigo |
| GET    | `/api/<uuid>/`      | Detalha uma lista específica |
| DELETE | `/api/<uuid>/`      | Remove uma lista e retorna mensagem de sucesso |
| GET    | `/api/shared/<id>/` | Recupera uma lista pública via link compartilhável |

## 📁 Estrutura Simplificada

```
projeto002/
├── backend/
│   ├── movie_api/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── movie_project/
│   │   ├── settings.py
│   │   └── urls.py
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── vite.config.js
├── INSTRUÇÕES.md
└── README.md
```

## ✅ Checklist de Funcionalidades

- [x] Busca na TMDb com feedback rápido
- [x] Favoritar/desfavoritar filmes
- [x] Salvar lista nomeada e gerar link compartilhável
- [x] Gerenciar múltiplas listas (selecionar, visualizar, excluir)
- [x] Página pública para listas compartilhadas
- [x] Persistência local + sincronização com backend
- [x] UI responsiva com tema futuro/glassmorphism

## 🧪 Testes & Ferramentas

- `test-api.py` fornece um script opcional para validar o fluxo de salvar/compartilhar via linha de comando.
- Recomenda-se testar manualmente a exclusão/seleção de listas após alterações.

---


