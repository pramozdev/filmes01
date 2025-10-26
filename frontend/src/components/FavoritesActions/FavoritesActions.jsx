import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { favoritesService } from '../../services/api';
import './FavoritesActions.css';
import { FiSave, FiShare2, FiFilm } from 'react-icons/fi';

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
      onError('Erro ao salvar sua lista de favoritos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareFavorites = () => {
    if (favorites.length === 0) {
      onError('Adicione pelo menos um filme aos favoritos antes de compartilhar.');
      return;
    }
    
    const shareUrl = `${window.location.origin}/shared/${Date.now()}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        onSaveSuccess({ message: 'Link copiado para a área de transferência!', url: shareUrl });
      })
      .catch(() => {
        onError('Não foi possível copiar o link. Tente novamente.');
      });
  };

  return (
    <div className="favorites-actions">
      <div className="favorites-count">
        <span className="count-number">{favorites.length}</span>
        <p>filme{favorites.length !== 1 ? 's' : ''} na sua lista</p>
      </div>
      
      {favorites.length > 0 && (
        <div className="form-group">
          <input
            type="text"
            id="listName"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="list-name-input"
            disabled={isLoading}
            placeholder="Nome da sua lista de filmes"
            maxLength={50}
          />
        </div>
      )}

      <div className="actions-container">
        <button
          className="action-button save-button"
          onClick={handleSaveFavorites}
          disabled={isLoading || favorites.length === 0}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Salvando...
            </>
          ) : (
            <>
              <span className="button-icon"><FiSave /></span>
              Salvar Lista
            </>
          )}
        </button>
        
        <button
          className="action-button share-button"
          onClick={handleShareFavorites}
          disabled={isLoading || favorites.length === 0}
        >
          <span className="button-icon"><FiShare2 /></span>
          Compartilhar
        </button>
      </div>
    </div>
  );
};

FavoritesActions.propTypes = {
  favorites: PropTypes.array.isRequired,
  onSaveSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default FavoritesActions;
