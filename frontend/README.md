# MovieLand - Plataforma de Filmes

Bem-vindo ao MovieLand, uma plataforma moderna de descoberta de filmes desenvolvida com React e Vite. Este projeto permite que os usuários explorem filmes populares, visualizem detalhes, assistam a trailers e muito mais.

## 🚀 Funcionalidades

- 🎬 Carrossel de filmes em destaque com navegação suave
- 🔍 Busca avançada de filmes
- 📱 Design responsivo que funciona em qualquer dispositivo
- ⚡ Carregamento rápido com React 18 e Vite
- 🎨 Interface moderna e intuitiva
- 🌐 Navegação entre páginas com React Router
- 📱 Página de detalhes do filme com:
  - Sinopse completa
  - Elenco e equipe
  - Trailer oficial
  - Filmes similares
  - Avaliações

## 🛠️ Tecnologias Utilizadas

- ⚛️ React 18
- 🚀 Vite
- 🔄 React Router DOM
- 💅 Styled Components e CSS Modules
- 🔍 API do TMDB (The Movie Database)
- 🎨 Ícones do React Icons
- 🎬 Player de vídeo integrado

## 📦 Como Executar o Projeto

1. **Pré-requisitos**
   - Node.js (versão 16 ou superior)
   - npm ou yarn
   - Chave de API do TMDB (obtenha em [TMDB](https://www.themoviedb.org/settings/api))

2. **Configuração**
   ```bash
   # Clone o repositório
   git clone [URL_DO_REPOSITÓRIO]
   
   # Acesse a pasta do projeto
   cd projeto002/frontend
   
   # Instale as dependências
   npm install
   # ou
   yarn
   
   # Crie um arquivo .env na raiz do projeto com sua chave da API TMDB
   VITE_TMDB_API_KEY=sua_chave_aqui
   ```

3. **Iniciando o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse o projeto**
   Abra seu navegador e acesse: [http://localhost:5173](http://localhost:5173)

## 🏗️ Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── MovieCarousel/  # Carrossel de filmes em destaque
│   ├── MovieCard/      # Card de filme
│   ├── MovieDetails/   # Componente de detalhes do filme
│   ├── SearchBar/      # Barra de busca
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Home/           # Página inicial
│   ├── MovieDetail/    # Página de detalhes do filme
│   └── ...
├── services/           # Serviços e APIs
│   └── tmdb.js         # Cliente da API do TMDB
├── styles/             # Estilos globais
└── App.jsx             # Componente raiz
```

## 🎨 Personalização

### Variáveis de Estilo

Você pode personalizar o tema do projeto modificando as variáveis CSS no arquivo `src/styles/global.css`:

```css
:root {
  --primary: #ff4d4f;
  --primary-dark: #d9363e;
  --background: #0f0f1a;
  --text: #ffffff;
  --text-secondary: #b8b8c7;
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ por [Seu Nome]
