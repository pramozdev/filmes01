import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import MovieDetails from '../../components/MovieDetails';
import FavoritesActions from '../../components/FavoritesActions';
import { favoritesService } from '../../services/api';
import './Favoritos.css';

const Favoritos = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [remoteError, setRemoteError] = useState('');
  const [listError, setListError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const currentList = favoriteLists.find((list) => list.id === selectedListId);
  const currentListDate = currentList?.created_at ? new Date(currentList.created_at) : null;

  const formatMovieCount = (count) => {
    return count === 1 ? '1 filme' : `${count} filmes`;
  };

  // Carregar favoritos do localStorage
  useEffect(() => {
    const initializeFavorites = async () => {
      try {
        const [savedFavorites, savedListId] = [
          localStorage.getItem('movieFavorites'),
          localStorage.getItem('lastFavoriteListId')
        ];

        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites);
          }
        }

        if (savedListId) {
          setSelectedListId(savedListId);
        }

        await loadFavoriteLists(savedListId);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setRemoteError('Não foi possível carregar seus favoritos salvos.');
      } finally {
        setLoading(false);
      }
    };

    initializeFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavoriteLists = async (preferredListId = null) => {
    try {
      const lists = await favoritesService.getAllLists();
      setFavoriteLists(lists);

      if (lists.length === 0) {
        setSelectedListId(null);
        setFavorites([]);
        localStorage.removeItem('lastFavoriteListId');
        return;
      }

      let nextSelectedId = preferredListId;
      if (!nextSelectedId || !lists.some(list => list.id === nextSelectedId)) {
        nextSelectedId = lists[0].id;
      }

      setSelectedListId(nextSelectedId);
      localStorage.setItem('lastFavoriteListId', nextSelectedId);

      const selectedList = lists.find(list => list.id === nextSelectedId);
      if (selectedList?.movies) {
        setFavorites(selectedList.movies);
        localStorage.setItem('movieFavorites', JSON.stringify(selectedList.movies));
      }
    } catch (error) {
      console.error('Erro ao listar listas de favoritos:', error);
      setListError('Não foi possível carregar suas listas salvas.');
    }
  };

  // Salvar favoritos no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      setFavorites(updatedFavorites);
      if (selectedListId) {
        localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
      }
      showMessage('Filme removido dos favoritos', 'success');
    } else {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      if (selectedListId) {
        localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
      }
      showMessage('Filme adicionado aos favoritos', 'success');
    }
  };

  const handleSaveSuccess = async (response) => {
    if (response?.movies) {
      setFavorites(response.movies);
      localStorage.setItem('movieFavorites', JSON.stringify(response.movies));
    }

    if (response?.id) {
      localStorage.setItem('lastFavoriteListId', response.id);
      setSelectedListId(response.id);
    }

    if (response?.share_url) {
      const fullUrl = `${window.location.origin}${response.share_url}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        showMessage('Lista salva e link copiado para a área de transferência!', 'success');
      }).catch(() => {
        showMessage('Lista salva! Copie o link manualmente se desejar compartilhar.', 'info');
      });
    }

    showMessage(response?.message || 'Lista salva com sucesso!', 'success');
    await loadFavoriteLists(response?.id);
  };

  const handleError = (errorMessage) => {
    showMessage(errorMessage, 'error');
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMovie(null);
  };

  const clearAllFavorites = () => {
    if (window.confirm('Tem certeza que deseja remover todos os filmes dos favoritos?')) {
      setFavorites([]);
      localStorage.removeItem('lastFavoriteListId');
      showMessage('Todos os filmes foram removidos dos favoritos', 'success');
    }
  };

  const handleSelectList = async (listId) => {
    try {
      setSelectedListId(listId);
      localStorage.setItem('lastFavoriteListId', listId);

      const list = await favoritesService.getFavoriteList(listId);
      const listMovies = list?.movies || [];
      setFavorites(listMovies);
      localStorage.setItem('movieFavorites', JSON.stringify(listMovies));
    } catch (error) {
      console.error('Erro ao carregar lista selecionada:', error);
      showMessage('Não foi possível carregar a lista selecionada.', 'error');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta lista?')) {
      return;
    }

    try {
      await favoritesService.deleteFavoriteList(listId);
      showMessage('Lista excluída com sucesso!', 'success');

      const remainingLists = favoriteLists.filter(list => list.id !== listId);
      setFavoriteLists(remainingLists);

      if (selectedListId === listId) {
        const nextSelected = remainingLists[0]?.id || null;
        setSelectedListId(nextSelected);

        if (nextSelected) {
          await handleSelectList(nextSelected);
        } else {
          setFavorites([]);
          localStorage.removeItem('lastFavoriteListId');
          localStorage.removeItem('movieFavorites');
        }
      }
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      showMessage('Erro ao excluir lista. Tente novamente.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando seus favoritos...</h2>
      </div>
    );
  }

  return (
    <div className="favoritos-page">
      <div className="container">
        <div className="favoritos-header">
          <h1 className="page-title">
            ❤️ Meus Favoritos
          </h1>
          <p className="page-subtitle">
            Gerencie sua lista pessoal de filmes favoritos
          </p>
        </div>

        {remoteError && (
          <div className="message error">
            {remoteError}
          </div>
        )}

        {listError && (
          <div className="message error">
            {listError}
          </div>
        )}

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="favorites-layout">
          <section className="favorite-lists">
            <div className="lists-header">
              <h2>Minhas listas</h2>
              <p>Selecione uma lista para visualizar, compartilhar ou excluir.</p>
            </div>

            {favoriteLists.length === 0 ? (
              <div className="empty-lists">
                <p>
                  Nenhuma lista salva ainda.<br />
                  Salve seus favoritos para criar listas nomeadas.
                </p>
              </div>
            ) : (
              <div className="lists-grid">
                {favoriteLists.map((list) => (
                  <div
                    key={list.id}
                    className={`list-card ${selectedListId === list.id ? 'selected' : ''}`}
                  >
                    <button
                      type="button"
                      className="list-card-content"
                      onClick={() => handleSelectList(list.id)}
                    >
                      <span className="list-name">{list.name}</span>
                      <span className="list-count">{formatMovieCount(list.movies?.length || 0)}</span>
                      <span className="list-date">
                        Criada em {new Date(list.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="delete-list-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="favorite-main">
            <div className="current-list-header">
              <div>
                <span className="section-label">Lista selecionada</span>
                <h2>{currentList ? currentList.name : 'Favoritos em criação'}</h2>
              </div>

              <div className="current-list-meta">
                <span className="meta-item">{formatMovieCount(favorites.length)}</span>
                <span className="meta-item">
                  {currentListDate
                    ? `Criada em ${currentListDate.toLocaleDateString('pt-BR')}`
                    : 'Ainda não salva'}
                </span>
              </div>
            </div>

            <FavoritesActions
              favorites={favorites}
              onSaveSuccess={handleSaveSuccess}
              onError={handleError}
            />

            {favorites.length > 0 ? (
              <>
                <div className="favorites-controls">
                  <button 
                    onClick={clearAllFavorites}
                    className="clear-all-btn"
                  >
                    Limpar todos
                  </button>
                </div>

                <div className="favorites-grid">
                  {favorites.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                      onShowDetails={handleShowDetails}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-favorites">
                <div className="empty-icon">🎬</div>
                <h2>Nenhum filme favorito ainda</h2>
                <p>Comece adicionando filmes aos seus favoritos na página inicial!</p>
                <Link to="/" className="back-to-home-btn">
                  Buscar filmes
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={handleCloseDetails}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={true}
        />
      )}
    </div>
  );
};

export default Favoritos;
