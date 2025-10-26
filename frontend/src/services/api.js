import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura o interceptor para logar erros de requisição
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  error => {
    console.error('Erro na requisição:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    return Promise.reject(error);
  }
);

export const favoritesService = {
  // Envia os dados para criação/atualização de uma lista de favoritos
  saveFavorites: async (name, movies) => {
    try {
      // Garante que os filmes tenham o formato correto
      const formattedMovies = (movies || []).map(movie => ({
        id: movie.id,
        title: movie.title || 'Título não disponível',
        poster_path: movie.poster_path || null,
        overview: movie.overview || 'Sinopse não disponível',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || ''
      }));

      console.log('Enviando dados para salvar:', {
        name,
        movie_count: formattedMovies.length,
        first_movie: formattedMovies[0] ? {
          id: formattedMovies[0].id,
          title: formattedMovies[0].title,
          overview: formattedMovies[0].overview?.substring(0, 50) + '...'
        } : null
      });

      const response = await api.post('/save/', {
        name: name || 'Minha Lista de Favoritos',
        movies: formattedMovies,
      });

      console.log('Resposta do servidor:', response.data);
      
      if (response.data && response.data.status === 'error') {
        throw new Error(response.data.message || 'Erro ao salvar a lista');
      }
      
      return response.data;
    } catch (error) {
      const errorDetails = {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      };
      
      console.error('Erro detalhado ao salvar favoritos:', errorDetails);
      
      // Extrai a mensagem de erro da resposta do servidor, se disponível
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Erro ao salvar a lista de favoritos';
      
      throw new Error(errorMessage);
    }
  },

  // Recupera uma lista compartilhada pelo ID
  getSharedList: async (listId) => {
    try {
      const response = await api.get(`/shared/${listId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lista compartilhada:', error);
      throw error;
    }
  },

  // Retorna todas as listas salvas no backend
  getAllLists: async () => {
    try {
      console.log('Buscando listas de favoritos...');
      const response = await api.get('/lists/');
      console.log('Resposta da API (getAllLists):', response.data);
      
      // Verifica se a resposta tem a estrutura esperada
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        console.warn('Formato de resposta inesperado:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar listas de favoritos:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Tenta carregar do localStorage em caso de erro
      try {
        const localData = localStorage.getItem('favoriteLists');
        if (localData) {
          const parsed = JSON.parse(localData);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.error('Erro ao carregar dados do localStorage:', e);
      }
      
      return [];
    }
  },

  // Cria uma nova lista de favoritos manualmente
  createFavoriteList: async (data) => {
    try {
      const response = await api.post('/create/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      throw error;
    }
  },

  // Busca detalhes de uma lista específica
  getFavoriteList: async (listId) => {
    try {
      const response = await api.get(`/${listId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lista:', error);
      throw error;
    }
  },

  // Remove uma lista de favoritos
  deleteFavoriteList: async (listId) => {
    console.log(`Enviando requisição DELETE para /${listId}/`);
    try {
      const response = await api.delete(`/${listId}/`);
      console.log('Resposta da API (delete):', response);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir lista:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        url: error.config?.url
      });
      throw error;
    }
  },
};
