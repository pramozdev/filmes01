# 🎬 Movie Favorites Manager

Aplicação full stack completa para pesquisa e gerenciamento de filmes favoritos, implementada com React + Vite (frontend) e Django + Django REST Framework (backend).

## 🚀 Tecnologias Implementadas

### Frontend
- **React 18** com Vite para desenvolvimento rápido
- **React Router** para navegação entre páginas
- **Axios** para requisições HTTP
- **CSS3** com design responsivo e moderno
- **TMDb API** para busca de filmes

### Backend
- **Django 4.2.7** com Django REST Framework
- **SQLite** para persistência de dados
- **CORS** configurado para integração front-back
- **UUID** para identificação única das listas
- **JSON** para armazenamento de dados dos filmes

## 🎯 Funcionalidades Implementadas

### ✅ Frontend
- [x] Interface de busca de filmes usando TMDb API
- [x] Exibição de detalhes de cada filme (imagem, título, nota, sinopse)
- [x] Gerenciamento de favoritos (adicionar/remover)
- [x] Botão para salvar favoritos no backend
- [x] Geração de link compartilhável
- [x] Página para exibir lista compartilhada via link
- [x] Design responsivo e moderno
- [x] Persistência local dos favoritos

### ✅ Backend
- [x] API REST para salvar e recuperar listas de favoritos
- [x] Cada lista possui um ID único (UUID) usado no link compartilhável
- [x] Estrutura do modelo: lista de filmes em JSON
- [x] Configuração de CORS para comunicação com o front-end
- [x] Persistência no banco de dados SQLite
- [x] Endpoints documentados e testados

## 🛠️ Como executar

### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
projeto002/
├── backend/                 # Django REST API
│   ├── movie_api/
│   │   ├── models.py       # Modelos de dados
│   │   ├── views.py        # Views da API
│   │   ├── urls.py         # URLs da API
│   │   └── serializers.py  # Serializers
│   ├── movie_project/
│   │   ├── settings.py     # Configurações Django
│   │   └── urls.py         # URLs principais
│   └── manage.py
└── frontend/               # React + Vite
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/         # Páginas
    │   ├── services/      # Serviços API
    │   └── styles/        # Estilos CSS
    └── package.json
```

## 🔑 Configuração da API TMDb

Para usar a funcionalidade de busca de filmes, você precisa de uma chave da API TMDb:

1. Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Crie uma conta e solicite uma API key
3. No frontend, configure a variável `VITE_TMDB_API_KEY` no arquivo `.env`

## 📱 Funcionalidades

- **Busca de Filmes**: Pesquise filmes usando a API TMDb
- **Favoritos**: Adicione/remova filmes dos favoritos
- **Compartilhamento**: Gere links para compartilhar suas listas
- **Persistência**: Salve suas listas no backend
- **Responsivo**: Interface adaptada para mobile e desktop
