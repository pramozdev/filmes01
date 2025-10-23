# 🎬 Movie Favorites Manager - Instruções de Uso

## ✅ Aplicação Criada com Sucesso!

Sua aplicação full stack para pesquisa e gerenciamento de filmes favoritos foi criada e está pronta para uso!

## 🚀 Como Executar a Aplicação

### 1. Backend (Django)
```bash
cd backend
python manage.py runserver
```
O backend estará disponível em: `http://localhost:8000`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
O frontend estará disponível em: `http://localhost:5173`

### 3. Scripts Automáticos (Windows)
- Execute `start-backend.bat` para iniciar o backend
- Execute `start-frontend.bat` para iniciar o frontend

## 🔑 Configuração da API TMDb

Para usar a funcionalidade de busca de filmes:

1. Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Crie uma conta e solicite uma API key gratuita
3. Copie o arquivo `frontend/env.example` para `frontend/.env`
4. Substitua `your_api_key_here` pela sua chave da API

## 🎯 Funcionalidades Implementadas

### ✅ Frontend
- ✅ Interface de busca de filmes usando TMDb API
- ✅ Exibição de detalhes de cada filme (imagem, título, nota, sinopse)
- ✅ Gerenciamento de favoritos (adicionar/remover)
- ✅ Botão para salvar favoritos no backend
- ✅ Geração de link compartilhável
- ✅ Página para exibir lista compartilhada via link
- ✅ Design responsivo e moderno
- ✅ Persistência local dos favoritos

### ✅ Backend
- ✅ API REST para salvar e recuperar listas de favoritos
- ✅ Cada lista possui um ID único (UUID) usado no link compartilhável
- ✅ Estrutura do modelo: lista de filmes em JSON
- ✅ Configuração de CORS para comunicação com o front-end
- ✅ Persistência no banco de dados SQLite
- ✅ Endpoints documentados e testados

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
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # Serviços API
│   │   └── styles/        # Estilos CSS
│   └── package.json
├── start-backend.bat      # Script para iniciar backend
├── start-frontend.bat     # Script para iniciar frontend
└── README.md             # Documentação completa
```

## 🌐 URLs da API

- `POST /api/save/` - Salvar lista de favoritos
- `GET /api/shared/{list_id}/` - Buscar lista compartilhada
- `POST /api/create/` - Criar nova lista
- `GET /api/{list_id}/` - Buscar detalhes de uma lista

## 🎨 Design e UX

- Interface moderna e responsiva
- Gradientes e animações suaves
- Cards de filmes com hover effects
- Mensagens de feedback para o usuário
- Loading states e tratamento de erros
- Design mobile-first

## 🔧 Tecnologias Utilizadas

### Frontend
- React 18 com Vite
- React Router para navegação
- Axios para requisições HTTP
- CSS3 com design responsivo
- TMDb API para dados dos filmes

### Backend
- Django 4.2.7
- Django REST Framework
- SQLite para banco de dados
- CORS para integração front-back
- UUID para IDs únicos

## 🎉 Pronto para Usar!

Sua aplicação está completamente funcional e pronta para uso. Basta configurar a API key do TMDb e executar os servidores!

Para mais informações, consulte o arquivo `README.md` na raiz do projeto.

