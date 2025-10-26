import React, { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import SearchBar from '../components/SearchBar/SearchBar';
import MovieCard from '../components/MovieCard/MovieCard';
import MovieDetails from '../components/MovieDetails/MovieDetails';
import FavoritesActions from '../components/FavoritesActions/FavoritesActions';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
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
  
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!query.trim()) {
      // Se a busca estiver vazia, carrega os filmes populares
      loadPopularMovies();
      return;
    }
    
    setLoading(true);
    try {
      // Se houver um termo de busca, faz a busca por texto
      const searchData = await tmdbService.searchMovies(query);
      let filteredMovies = searchData.results || [];
      
      // Se não houver resultados na busca, tenta buscar por gênero
      if (filteredMovies.length === 0) {
        const genreData = await tmdbService.getMoviesByGenre(query);
        if (genreData && genreData.results && genreData.results.length > 0) {
          filteredMovies = genreData.results;
        }
      }
      
      // Aplicar filtros adicionais
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
      
      // Ordenar resultados se necessário
      if (searchFilters.sortBy) {
        const [sortField, sortOrder] = searchFilters.sortBy.split('.');
        filteredMovies.sort((a, b) => {
          const valueA = sortField === 'release_date' 
            ? new Date(a[sortField] || 0).getTime() 
            : a[sortField] || 0;
            
          const valueB = sortField === 'release_date' 
            ? new Date(b[sortField] || 0).getTime() 
            : b[sortField] || 0;
            
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        });
      }
      
      setMovies(filteredMovies);
      
      if (filteredMovies.length === 0) {
        showMessage('Nenhum filme encontrado para sua busca. Tente outro termo.', 'info');
      } else {
        showMessage(`Encontrados ${filteredMovies.length} filmes para "${query}"`, 'success');
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      showMessage('Erro ao buscar filmes. Por favor, tente novamente.', 'error');
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

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadPopularMovies();
  };

  return (
    <div className="home-container">
      {/* Carrossel de filmes em destaque */}
      <MovieCarousel />
      
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">
            🎬 Descubra seus filmes favoritos
          </h1>
          <p className="hero-subtitle">
            Busque, explore e salve seus filmes preferidos em listas personalizadas
          </p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          onClear={handleClearSearch}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          loading={loading} 
          filters={filters} 
          setFilters={setFilters}
        />

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
