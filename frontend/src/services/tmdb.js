import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('[tmdbService] VITE_TMDB_API_KEY não foi definido. Solicitações à TMDb irão falhar até que a chave seja configurada.');
}
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'pt-BR',
  },
});

export const tmdbService = {
  // Busca filmes por texto digitado pelo usuário
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: {
          query,
          page,
          include_adult: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      throw error;
    }
  },

  // Busca lista paginada dos filmes mais populares do momento
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      throw error;
    }
  },

  // Busca dados detalhados de um filme específico
  getMovieDetails: async (movieId) => {
    try {
      // Busca todos os detalhes em paralelo para melhor performance
      const [details, credits, videos, similar, reviews, watchProviders] = await Promise.all([
        tmdbApi.get(`/movie/${movieId}`, {
          params: { append_to_response: 'release_dates,keywords' }
        }),
        tmdbApi.get(`/movie/${movieId}/credits`),
        tmdbApi.get(`/movie/${movieId}/videos`, {
          params: { language: 'pt-BR,en-US' }
        }),
        tmdbApi.get(`/movie/${movieId}/similar`, {
          params: { language: 'pt-BR', page: 1 }
        }),
        tmdbApi.get(`/movie/${movieId}/reviews`, {
          params: { language: 'pt-BR,en-US', page: 1 }
        }),
        tmdbApi.get(`/movie/${movieId}/watch/providers`)
      ]);

      return {
        ...details.data,
        credits: credits.data,
        videos: videos.data,
        similar: similar.data,
        reviews: reviews.data,
        watchProviders: watchProviders.data.results?.BR || {}
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      throw error;
    }
  },

  // Método mantido para compatibilidade
  getMovieTrailers: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar trailers do filme:', error);
      return { results: [] };
    }
  },

  // Busca o elenco do filme
  getMovieCredits: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar elenco do filme:', error);
      return { cast: [], crew: [] };
    }
  },

  // Busca vídeos do filme
  getMovieVideos: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vídeos do filme:', error);
      return { results: [] };
    }
  },

  // Busca filmes similares
  getSimilarMovies: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filmes similares:', error);
      return { results: [] };
    }
  },

  // Busca avaliações do filme
  getMovieReviews: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar avaliações do filme:', error);
      return { results: [] };
    }
  },

  // Busca informações adicionais sobre pessoas (atores, diretores, etc)
  getPersonDetails: async (personId) => {
    try {
      const response = await tmdbApi.get(`/person/${personId}`, {
        params: { append_to_response: 'movie_credits' }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da pessoa:', error);
      throw error;
    }
  },

  // Monta a URL do poster; se a API não devolver caminho, usamos uma imagem genérica
  getImageUrl: (path, size = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=Imagem+indispon%C3%ADvel';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Busca o elenco do filme
  getMovieCredits: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/credits`);
      // Retorna os primeiros 5 atores principais
      return response.data.cast.slice(0, 5).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path
      }));
    } catch (error) {
      console.error('Erro ao buscar elenco do filme:', error);
      return [];
    }
  },
  
  // Busca filmes por gênero
  getMoviesByGenre: async (genreName, page = 1) => {
    try {
      // Primeiro, tenta encontrar o ID do gênero pelo nome
      const genresResponse = await tmdbApi.get('/genre/movie/list');
      const genre = genresResponse.data.genres.find(
        g => g.name.toLowerCase() === genreName.toLowerCase()
      );
      
      if (!genre) {
        return { results: [], total_results: 0 };
      }
      
      // Depois busca os filmes por ID do gênero
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_genres: genre.id,
          page,
          sort_by: 'popularity.desc',
          include_adult: false,
          include_video: false,
          with_watch_monetization_types: 'flatrate',
          language: 'pt-BR'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filmes por gênero:', error);
      return { results: [], total_results: 0 };
    }
  }
};
