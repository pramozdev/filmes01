import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { favoritesService } from '../services/api';
import MovieCard from '../components/MovieCard/MovieCard';
import './SharedList.css';


/**
 * Componente para exibir uma lista de filmes compartilhada
 * @component
 * @example
 * return <SharedList />
 */
const SharedList = () => {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSharedList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await favoritesService.getSharedList(listId);
      setList(data);
    } catch (error) {
      setError('Lista não encontrada ou não existe mais.');
      console.error('Erro ao carregar lista compartilhada:', error);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    loadSharedList();
  }, [loadSharedList]);

  /**
   * Manipulador para adicionar/remover filmes dos favoritos
   * Pode ser implementado para adicionar filmes aos favoritos locais
   */
  const handleToggleFavorite = () => {
    // Esta funcionalidade pode ser implementada para adicionar filmes aos favoritos locais
    console.log('Funcionalidade de adicionar aos favoritos pode ser implementada aqui');
  };

  if (loading) {
    return (
      <div className="shared-list">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando lista compartilhada...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="shared-list">
        <div className="container">
          <div className="error-container">
            <h2>😞 Lista não encontrada</h2>
            <p>{error || 'A lista que você está procurando não existe mais ou foi removida.'}</p>
            <a href="/" className="back-button">
              ← Voltar para a página inicial
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-list">
      <div className="container">
        <div className="list-header">
          <h1 className="list-title">📋 {list.name}</h1>
          <div className="list-info">
            <span className="movie-count">
              {list.movies?.length || 0} {list.movies?.length === 1 ? 'filme' : 'filmes'}
            </span>
            <span className="list-date">
              Criada em {new Date(list.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {list.movies && list.movies.length > 0 ? (
          <div className="movies-grid">
            {list.movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={false}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-list">
            <p>Esta lista está vazia.</p>
          </div>
        )}

        <div className="list-actions">
          <a href="/" className="back-button">
            ← Criar minha própria lista
          </a>
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedList;
