import React from 'react';
import { tmdbService } from '../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, isFavorite = false, onToggleFavorite, onShowDetails }) => {
  const handleToggleFavorite = () => {
    onToggleFavorite(movie);
  };

  const handleShowDetails = () => {
    if (onShowDetails) {
      onShowDetails(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={tmdbService.getImageUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            type="button"
          >
            <span aria-hidden="true">{isFavorite ? '❤️' : '🤍'}</span>
            <span className="sr-only">
              {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </span>
          </button>
        </div>
      </div>
      <div className="movie-info">
        <div className="movie-content">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-rating">
            <span className="rating-star">⭐</span>
            <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
          <p className="movie-overview">
            {movie.overview?.length > 100 
              ? `${movie.overview.substring(0, 100)}...` 
              : movie.overview || 'Sinopse não disponível'
            }
          </p>
          <div className="movie-year">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </div>
        </div>

        <div className="movie-actions">
          <button
            className={`favorite-action-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
            type="button"
          >
            {isFavorite ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
          </button>
          
          <button
            className="details-btn"
            onClick={handleShowDetails}
            type="button"
          >
            📖 Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
