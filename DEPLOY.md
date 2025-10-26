# Deploy na Render

Este guia explica como fazer o deploy da aplicação Movie Favorites na Render, incluindo o backend (Django), frontend (React) e banco de dados (PostgreSQL).

## Pré-requisitos

1. Uma conta na [Render](https://render.com/)
2. Git instalado localmente
3. Conta no GitHub, GitLab ou Bitbucket (para integração contínua)

## Passo a Passo para o Deploy

### 1. Preparação do Código

1. Faça um fork deste repositório para a sua conta do GitHub/GitLab/Bitbucket
2. Clone o repositório para sua máquina local
3. Certifique-se de que todas as alterações foram commitadas e enviadas para o repositório remoto

### 2. Criar o Banco de Dados na Render

1. Acesse o [Painel da Render](https://dashboard.render.com/)
2. Clque em "New +" e selecione "PostgreSQL"
3. Preencha os campos:
   - Name: `movie-db`
   - Database: `movie_db`
   - User: `movie_user`
   - Region: Escolha a região mais próxima de você
   - Plan: Free
4. Clique em "Create Database"
5. Anote as credenciais fornecidas (você precisará delas mais tarde)

### 3. Configurar o Backend (Django)

1. No painel da Render, clique em "New +" e selecione "Web Service"
2. Conecte sua conta do GitHub/GitLab/Bitbucket e selecione o repositório
3. Preencha os campos:
   - Name: `movie-api`
   - Region: Escolha a mesma região do banco de dados
   - Branch: `main` (ou a branch que deseja fazer deploy)
   - Root Directory: (deixe em branco)
   - Build Command: `pip install -r backend/requirements.txt && python backend/manage.py migrate && python backend/manage.py collectstatic --noinput`
   - Start Command: `gunicorn movie_project.wsgi:application`
4. Na seção "Advanced", clique em "Add Environment Variable" e adicione:
   - `PYTHON_VERSION`: `3.10.0`
   - `DJANGO_SETTINGS_MODULE`: `movie_project.settings.production`
   - `DJANGO_ALLOWED_HOSTS`: `movie-api.onrender.com`
   - `CORS_ALLOWED_ORIGINS`: `https://movie-favorites.onrender.com`
   - `DEBUG`: `False`
   - `SECRET_KEY`: Gere uma chave segura com: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
   - `DATABASE_URL`: Cole a URL de conexão do banco de dados criado no passo 2
5. Clique em "Create Web Service"

### 4. Configurar o Frontend (React)

1. No painel da Render, clique em "New +" e selecione "Static Site"
2. Conecte sua conta do GitHub/GitLab/Bitbucket e selecione o mesmo repositório
3. Preencha os campos:
   - Name: `movie-favorites`
   - Branch: `main` (ou a branch que deseja fazer deploy)
   - Root Directory: (deixe em branco)
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
4. Na seção "Environment Variables", adicione:
   - `VITE_API_URL`: `https://movie-api.onrender.com` (substitua pelo URL do seu backend)
5. Clique em "Create Static Site"

### 5. Atualizar Configurações do Backend

1. Após o deploy do frontend, anote a URL gerada (algo como `https://movie-favorites.onrender.com`)
2. Volte para as configurações do serviço `movie-api`
3. Atualize a variável de ambiente `CORS_ALLOWED_ORIGINS` com a URL do frontend
4. Reinicie o serviço para aplicar as alterações

### 6. Testar a Aplicação

1. Acesse a URL do frontend (algo como `https://movie-favorites.onrender.com`)
2. Verifique se a aplicação está funcionando corretamente
3. Teste as funcionalidades que dependem do backend

## Configurações Adicionais

### Variáveis de Ambiente Recomendadas para Produção

Para o serviço `movie-api`, considere adicionar estas variáveis de ambiente adicionais para melhorar a segurança:

- `SECURE_SSL_REDIRECT`: `True`
- `SESSION_COOKIE_SECURE`: `True`
- `CSRF_COOKIE_SECURE`: `True`
- `SECURE_BROWSER_XSS_FILTER`: `True`
- `SECURE_CONTENT_TYPE_NOSNIFF`: `True`
- `X_FRAME_OPTIONS`: `DENY`
- `SECURE_HSTS_SECONDS`: `31536000`
- `SECURE_HSTS_INCLUDE_SUBDOMAINS`: `True`
- `SECURE_HSTS_PRELOAD`: `True`

### Domínios Personalizados

Se desejar usar um domínio personalizado:

1. Vá para as configurações do serviço na Render
2. Na seção "Custom Domains", adicione seu domínio
3. Siga as instruções para configurar os registros DNS

## Solução de Problemas

### Migrações do Banco de Dados

Se precisar executar migrações adicionais após o deploy:

1. Acesse o serviço `movie-api` no painel da Render
2. Vá para a aba "Shell"
3. Execute: `python backend/manage.py migrate`

### Logs

Para ver os logs da aplicação:

1. Acesse o serviço no painel da Render
2. Vá para a aba "Logs"
3. Verifique os logs em caso de erros

### Acesso ao Banco de Dados

Para acessar o banco de dados PostgreSQL:

1. Acesse o banco de dados no painel da Render
2. Use as credenciais fornecidas
3. Você pode usar o psql ou uma ferramenta como DBeaver para se conectar

## Atualizações Futuras

Para atualizar a aplicação:

1. Faça as alterações no código
2. Commit e push para o repositório
3. O Render fará o deploy automático (se configurado)
4. Se necessário, execute migrações de banco de dados

## Suporte

Em caso de problemas, consulte a [documentação da Render](https://render.com/docs) ou entre em contato com o suporte.
