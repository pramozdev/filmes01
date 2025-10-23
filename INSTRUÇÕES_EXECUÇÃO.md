# 🎬 MovieFav - Aplicação de Lista de Filmes

## 📋 Visão Geral

Aplicação completa de gerenciamento de filmes favoritos com:
- **Frontend**: React com design futurístico e responsivo
- **Backend**: Django REST API
- **Integração**: API do The Movie Database (TMDb)
- **Funcionalidades**: Pesquisa, favoritos, compartilhamento de listas

## 🚀 Como Executar

### 1. Backend (Django)

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
pip install -r requirements.txt

# Executar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

O backend estará disponível em: `http://localhost:8000`

### 2. Frontend (React)

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 🔧 Configuração

### Chave API do TMDb
A chave API do TMDb já está configurada no código: `3e831d4c034a4ca7c81640da93ee7764`

### Variáveis de Ambiente (Opcional)
Crie um arquivo `.env` na pasta `frontend` com:
```
VITE_TMDB_API_KEY=3e831d4c034a4ca7c81640da93ee7764
```

## ✨ Funcionalidades Implementadas

### 🎯 Frontend
- **Interface Futurística**: Design com gradientes, efeitos de blur e animações
- **Pesquisa de Filmes**: Integração com API do TMDb
- **Cards de Filmes**: Exibição com rating destacado
- **Gerenciamento de Favoritos**: Adicionar/remover filmes
- **Página de Favoritos**: Visualização e edição da lista
- **Compartilhamento**: Salvar e compartilhar listas via link
- **Design Responsivo**: Adaptado para mobile, tablet e desktop

### 🔧 Backend
- **API REST**: Endpoints para gerenciar listas de favoritos
- **Modelo de Dados**: FavoriteList com UUID e JSONField
- **CORS**: Configurado para permitir requisições do frontend
- **Serializers**: Para validação e serialização de dados

### 🎨 Design Features
- **Tema Futurístico**: Cores ciano (#00f2ff) e rosa (#ff6b9d)
- **Efeitos Glassmorphism**: Backdrop blur e transparências
- **Animações**: Hover effects, glow effects, transições suaves
- **Responsividade**: Grid adaptativo para diferentes telas
- **Tipografia**: Fonte Inter com pesos variados

## 📱 Responsividade

- **Desktop**: Grid com 4+ colunas
- **Tablet**: Grid com 2-3 colunas
- **Mobile**: Grid com 1-2 colunas
- **Header**: Menu responsivo com navegação otimizada

## 🔗 Endpoints da API

- `POST /api/save/` - Salvar lista de favoritos
- `GET /api/shared/{id}/` - Buscar lista compartilhada
- `POST /api/create/` - Criar nova lista
- `GET /api/{id}/` - Buscar detalhes de uma lista

## 🎯 Como Usar

1. **Pesquisar Filmes**: Use a barra de pesquisa na página inicial
2. **Adicionar Favoritos**: Clique no coração nos cards dos filmes
3. **Ver Favoritos**: Clique em "Meus Favoritos" no header
4. **Salvar Lista**: Nomeie sua lista e clique em "Salvar Lista"
5. **Compartilhar**: O link será copiado automaticamente
6. **Visualizar Lista Compartilhada**: Acesse o link compartilhado

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 19.1.1
- React Router DOM 7.9.4
- Axios 1.12.2
- Vite 7.1.7
- CSS3 com animações e gradientes

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django CORS Headers 4.3.1
- SQLite (banco de dados)

### APIs Externas
- The Movie Database (TMDb) API

## 📝 Notas Importantes

- O projeto já está configurado e pronto para uso
- A chave API do TMDb está incluída no código
- O design é totalmente responsivo
- Todas as funcionalidades solicitadas foram implementadas
- O código está organizado e comentado

## 🎉 Pronto para Usar!

Execute os comandos acima e acesse `http://localhost:5173` para começar a usar a aplicação!
