import React, { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import SearchBar from '../components/SearchBar/SearchBar';
import MovieCard from '../components/MovieCard/MovieCard';
import MovieDetails from '../components/MovieDetails/MovieDetails';
import FavoritesActions from '../components/FavoritesActions/FavoritesActions';
import './Home.css';

import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    rating: ''
  });

  // Carregar favoritos do localStorage ao inicializar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Salvar favoritos no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Carregar filmes populares ao inicializar
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const data = await tmdbService.getPopularMovies();
      setMovies(data.results || []);
    } catch (error) {
      setError('Erro ao carregar filmes. Por favor, tente novamente.');
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, searchFilters = {}) => {
    setLoading(true);
    try {
      const data = await tmdbService.searchMovies(query);
      let filteredMovies = data.results || [];
      
      // Aplicar filtros
      if (searchFilters.year) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.release_date && movie.release_date.startsWith(searchFilters.year)
        );
      }
      
      if (searchFilters.rating) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.vote_average >= parseFloat(searchFilters.rating)
        );
      }
      
      setMovies(filteredMovies);
      if (filteredMovies.length === 0) {
        showMessage('Nenhum filme encontrado para sua busca', 'info');
      }
    } catch {
      showMessage('Erro ao buscar filmes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
      showMessage('Filme removido dos favoritos', 'success');
    } else {
      setFavorites([...favorites, movie]);
      showMessage('Filme adicionado aos favoritos', 'success');
    }
  };

  const handleSaveSuccess = (response) => {
    if (response.share_url) {
      const fullUrl = `${window.location.origin}${response.share_url}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        showMessage('Lista salva e link copiado para a área de transferência!', 'success');
      });
    } else {
      showMessage(response.message || 'Lista salva com sucesso!', 'success');
    }
  };

  const handleError = (errorMessage) => {
    showMessage(errorMessage, 'error');
  };

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMovie(null);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando filmes...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">
            🎬 Descubra seus filmes favoritos
          </h1>
          <p className="hero-subtitle">
            Busque, explore e salve seus filmes preferidos em listas personalizadas
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} filters={filters} setFilters={setFilters} />

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <FavoritesActions
          favorites={favorites}
          onSaveSuccess={handleSaveSuccess}
          onError={handleError}
        />

        <div className="movies-grid">
          {movies.map((movie) => {
            const isExpanded = showDetails && selectedMovie && selectedMovie.id === movie.id;
            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
                onToggleFavorite={handleToggleFavorite}
                onShowDetails={handleShowDetails}
                isExpanded={isExpanded}
              />
            );
          })}
        </div>

        {movies.length === 0 && !loading && (
          <div className="no-movies">
            <p>Nenhum filme encontrado. Tente uma nova busca!</p>
          </div>
        )}
      </div>
      
      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={handleCloseDetails}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.some(fav => fav.id === selectedMovie.id)}
        />
      )}
    </div>
  );
};

export default Home;
