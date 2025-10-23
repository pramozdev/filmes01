import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '3e831d4c034a4ca7c81640da93ee7764';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'pt-BR',
  },
});

export const tmdbService = {
  // Buscar filmes por query
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

  // Buscar filmes populares
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

  // Buscar detalhes de um filme específico
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      throw error;
    }
  },

  // Buscar trailers de um filme
  getMovieTrailers: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar trailers:', error);
      throw error;
    }
  },

  // Formatar URL da imagem
  getImageUrl: (path, size = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};
