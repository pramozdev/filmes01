import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaTimes } from 'react-icons/fa';
import { tmdbService } from '../../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, isFavorite = false, onToggleFavorite, onShowDetails, isExpanded = false }) => {
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie);
  };

  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails(movie);
    }
  };

  const cardClass = `movie-card ${isExpanded ? 'expanded' : ''}`;

  return (
    <div className={cardClass}>
      <div className="movie-poster" onClick={handleShowDetails}>
        <img
          src={movie.poster_path ? tmdbService.getImageUrl(movie.poster_path) : 'https://via.placeholder.com/300x450?text=Poster+Not+Available'}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x450?text=Poster+Not+Available';
          }}
        />
        {isExpanded && (
          <button 
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              // Aqui você pode adicionar a lógica para fechar/remover o card se necessário
              if (onShowDetails) {
                onShowDetails(null);
              }
            }}
            aria-label="Fechar"
            title="Fechar"
          >
            <FaTimes className="close-icon" />
          </button>
        )}
      </div>
      
      <div className="movie-content">
        <div className="movie-header" onClick={handleShowDetails}>
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            <span className="movie-rating">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="movie-info-container">
          {movie.overview && (
            <p className="movie-overview" onClick={handleShowDetails}>
              {movie.overview.length > 100 
                ? `${movie.overview.substring(0, 100)}...` 
                : movie.overview}
            </p>
          )}
          
          <div className="favorite-text" onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(e);
          }}>
            {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </div>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func.isRequired,
  onShowDetails: PropTypes.func,
  isExpanded: PropTypes.bool
};

export default MovieCard;
