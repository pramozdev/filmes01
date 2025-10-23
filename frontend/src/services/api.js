import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const favoritesService = {
  // Salvar lista de favoritos
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

  // Buscar lista compartilhada
  getSharedList: async (listId) => {
    try {
      const response = await api.get(`/shared/${listId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lista compartilhada:', error);
      throw error;
    }
  },

  // Listar todas as listas salvas
  getAllLists: async () => {
    try {
      const response = await api.get('/lists/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar listas de favoritos:', error);
      throw error;
    }
  },

  // Criar nova lista de favoritos
  createFavoriteList: async (data) => {
    try {
      const response = await api.post('/create/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      throw error;
    }
  },

  // Buscar detalhes de uma lista
  getFavoriteList: async (listId) => {
    try {
      const response = await api.get(`/${listId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lista:', error);
      throw error;
    }
  },

  // Excluir uma lista de favoritos
  deleteFavoriteList: async (listId) => {
    try {
      const response = await api.delete(`/${listId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      throw error;
    }
  },
};
