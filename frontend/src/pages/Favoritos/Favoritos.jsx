import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import MovieDetails from '../../components/MovieDetails/MovieDetails';
import FavoritesActions from '../../components/FavoritesActions/FavoritesActions';
import { favoritesService } from '../../services/api';
import './Favoritos.css';

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: '#1e293b',
  padding: '2rem',
  borderRadius: '12px',
  maxWidth: '450px',
  width: '90%',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
};

const buttonStyles = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  margin: '0.5rem',
  transition: 'all 0.2s ease',
};

const confirmButtonStyles = {
  ...buttonStyles,
  backgroundColor: '#ef4444',
  color: 'white',
};

const cancelButtonStyles = {
  ...buttonStyles,
  backgroundColor: '#334155',
  color: '#e2e8f0',
};

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
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
     
  }, []);

  const loadFavoriteLists = async (preferredListId = null) => {
    setLoading(true);
    setListError('');
    
    try {
      console.log('Carregando listas de favoritos...');
      const lists = await favoritesService.getAllLists();
      console.log('Listas carregadas:', lists);
      
      // Se não houver listas, limpa o estado
      if (!lists || lists.length === 0) {
        console.log('Nenhuma lista encontrada');
        setFavoriteLists([]);
        setSelectedListId(null);
        setFavorites([]);
        localStorage.removeItem('lastFavoriteListId');
        localStorage.removeItem('movieFavorites');
        setListError('Você ainda não tem listas salvas. Crie uma nova lista para começar!');
        return;
      }
      
      // Filtra listas inválidas
      const validLists = lists.filter(list => list && list.id);
      
      // Salva as listas válidas no estado e no localStorage
      setFavoriteLists(validLists);
      localStorage.setItem('favoriteLists', JSON.stringify(validLists));

      // Tenta usar a lista preferida, senão usa a primeira da lista
      let nextSelectedId = preferredListId;
      if (!nextSelectedId || !validLists.some(list => list.id === nextSelectedId)) {
        nextSelectedId = validLists[0]?.id || null;
        console.log(`Usando a primeira lista disponível: ${nextSelectedId}`);
      }

      // Atualiza o ID da lista selecionada
      if (nextSelectedId) {
        setSelectedListId(nextSelectedId);
        localStorage.setItem('lastFavoriteListId', nextSelectedId);
      }

      // Atualiza a lista de filmes ativa
      const selectedList = validLists.find(list => list.id === nextSelectedId);
      if (selectedList?.movies && Array.isArray(selectedList.movies)) {
        console.log(`Atualizando filmes da lista ${nextSelectedId} com ${selectedList.movies.length} filmes`);
        setFavorites(selectedList.movies);
        localStorage.setItem('movieFavorites', JSON.stringify(selectedList.movies));
      } else {
        console.warn('Lista selecionada não contém filmes válidos:', selectedList);
        setFavorites([]);
        localStorage.removeItem('movieFavorites');
      }
      
    } catch (error) {
      console.error('Erro ao carregar listas de favoritos:', {
        message: error.message,
        error: error,
        stack: error.stack
      });
      
      // Tenta carregar do localStorage em caso de erro
      try {
        const localData = localStorage.getItem('favoriteLists');
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('Carregando listas do localStorage:', parsed);
            setFavoriteLists(parsed);
            
            // Tenta restaurar a última lista visualizada
            const lastListId = localStorage.getItem('lastFavoriteListId');
            const lastFavorites = localStorage.getItem('movieFavorites');
            
            if (lastListId && parsed.some(list => list.id === lastListId)) {
              // Se encontrou a última lista usada
              console.log(`Restaurando lista anterior: ${lastListId}`);
              setSelectedListId(lastListId);
              
              // Tenta carregar os filmes da lista
              try {
                if (lastFavorites) {
                  const movies = JSON.parse(lastFavorites);
                  if (Array.isArray(movies)) {
                    setFavorites(movies);
                    console.log(`Restaurados ${movies.length} filmes da lista ${lastListId}`);
                  }
                }
              } catch (e) {
                console.error('Erro ao carregar filmes do localStorage:', e);
              }
              
              return;
            } else if (parsed.length > 0) {
              // Se não encontrou a última lista, usa a primeira disponível
              const firstList = parsed[0];
              console.log(`Usando a primeira lista disponível do cache: ${firstList.id}`);
              setSelectedListId(firstList.id);
              
              if (firstList.movies && Array.isArray(firstList.movies)) {
                setFavorites(firstList.movies);
                localStorage.setItem('movieFavorites', JSON.stringify(firstList.movies));
              }
              
              return;
            }
          }
        }
      } catch (e) {
        console.error('Erro ao carregar dados do localStorage:', e);
      }
      
      // Se chegou aqui, não conseguiu carregar nenhuma lista
      setListError('Não foi possível carregar as listas de favoritos. Verifique sua conexão e tente novamente.');
      setFavoriteLists([]);
      setFavorites([]);
    } finally {
      setLoading(false);
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

  const handleDeleteClick = (listId) => {
    console.log('Solicitando confirmação para excluir lista:', listId);
    setListToDelete(listId);
    setShowDeleteModal(true);
  };

  const handleDeleteList = async () => {
    const listId = listToDelete;
    console.log('Iniciando exclusão da lista:', listId);
    setShowDeleteModal(false);
    
    if (!listId) {
      console.error('ID da lista não fornecido');
      return;
    }
    
    console.log('Usuário confirmou a exclusão. Prosseguindo...');
    
    try {
      // 1. Primeiro faz a chamada para a API
      console.log('Chamando API para deletar lista:', listId);
      const response = await favoritesService.deleteFavoriteList(listId);
      console.log('Resposta da API ao deletar:', response);
      
      // 2. Atualiza o estado local após a exclusão bem-sucedida
      const updatedLists = favoriteLists.filter(list => list.id !== listId);
      setFavoriteLists(updatedLists);
      
      // 3. Atualiza a lista selecionada se necessário
      if (selectedListId === listId) {
        const nextSelected = updatedLists[0]?.id || null;
        setSelectedListId(nextSelected);
        
        if (nextSelected) {
          // Carrega a próxima lista
          const nextList = updatedLists.find(list => list.id === nextSelected);
          if (nextList) {
            setFavorites(nextList.movies || []);
            localStorage.setItem('movieFavorites', JSON.stringify(nextList.movies || []));
            localStorage.setItem('lastFavoriteListId', nextSelected);
          }
        } else {
          // Se não houver mais listas, limpa tudo
          setFavorites([]);
          localStorage.removeItem('lastFavoriteListId');
          localStorage.removeItem('movieFavorites');
        }
      }
      
      showMessage('Lista excluída com sucesso!', 'success');
      console.log('Lista excluída com sucesso');
      
    } catch (error) {
      console.error('Erro ao excluir lista:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Em caso de erro, tenta recarregar a lista atual
      if (selectedListId === listId) {
        try {
          const list = await favoritesService.getFavoriteList(selectedListId);
          setFavorites(list?.movies || []);
        } catch (e) {
          console.error('Erro ao recarregar lista após falha na exclusão:', e);
          setFavorites([]);
        }
      }
      
      // Tenta recarregar todas as listas
      try {
        const updatedLists = await favoritesService.getAllLists();
        setFavoriteLists(updatedLists);
      } catch (e) {
        console.error('Erro ao carregar listas após falha na exclusão:', e);
      }
      
      showMessage('Erro ao excluir a lista. Tente novamente.', 'error');
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
                        event.preventDefault();
                        handleDeleteClick(list.id);
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
      
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>Confirmar Exclusão</h3>
            <p style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>
              Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button 
                style={cancelButtonStyles}
                onClick={() => {
                  console.log('Exclusão cancelada pelo usuário');
                  setShowDeleteModal(false);
                }}
              >
                Cancelar
              </button>
              <button 
                style={confirmButtonStyles}
                onClick={() => {
                  console.log('Usuário confirmou a exclusão');
                  handleDeleteList();
                }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favoritos;
