import React, { useState } from 'react';
import { favoritesService } from '../services/api';
import './FavoritesActions.css';

const FavoritesActions = ({ favorites, onSaveSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listName, setListName] = useState('Minha Lista de Favoritos');

  const handleSaveFavorites = async () => {
    if (favorites.length === 0) {
      onError('Adicione pelo menos um filme aos favoritos antes de salvar.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await favoritesService.saveFavorites(listName, favorites);
      onSaveSuccess(response);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);

      // Tratamento de erros mais específico
      if (error.response) {
        // O backend respondeu informando o tipo de falha
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.detail;
        
        if (status === 400) {
          onError(message || 'Dados inválidos. Verifique se todos os campos estão corretos.');
        } else if (status === 500) {
          onError('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          onError(`Erro do servidor (${status}): ${message || 'Tente novamente.'}`);
        }
      } else if (error.request) {
        // Falha na comunicação (requisição não recebeu resposta)
        onError('Erro de conexão. Verifique se o backend está rodando em http://localhost:9000');
      } else {
        // Erros inesperados (ex.: falha ao montar requisição)
        onError('Erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (shareUrl) => {
    const fullUrl = `${window.location.origin}${shareUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      onSaveSuccess({ message: 'Link copiado para a área de transferência!' });
    }).catch(() => {
      onError('Erro ao copiar link. Tente novamente.');
    });
  };

  return (
    <div className="favorites-actions">
      <div className="favorites-count">
        <span className="count-number">{favorites.length}</span>
        <span className="count-label">
          {favorites.length === 1 ? 'filme favorito' : 'filmes favoritos'}
        </span>
      </div>
      
      {favorites.length > 0 && (
        <div className="actions-group">
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="list-name-input"
            placeholder="Nome da sua lista"
            maxLength={50}
          />
          <button
            onClick={handleSaveFavorites}
            disabled={isLoading}
            className="save-button"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Salvando...
              </>
            ) : (
              <>
                💾 Salvar Lista
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesActions;
