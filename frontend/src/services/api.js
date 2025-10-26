import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const favoritesService = {
  // Envia os dados para criação/atualização de uma lista de favoritos
  saveFavorites: async (name, movies) => {
    try {
      console.log('Enviando dados para salvar:', { name, movies: movies.length });
      
      const response = await api.post('/save/', {
        name: name || 'Minha Lista de Favoritos',
        movies: movies || [],
      });
      
      console.log('Resposta do servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
      console.error('Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
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
      const response = await api.get('/lists/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar listas de favoritos:', error);
      throw error;
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
