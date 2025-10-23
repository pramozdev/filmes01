import React, { useState, useEffect } from 'react';
import { tmdbService } from '../services/tmdb';
import './MovieDetails.css';

const MovieDetails = ({ movie, onClose, onToggleFavorite, isFavorite }) => {
  const [details, setDetails] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        
        // Buscar detalhes completos do filme
        const movieDetails = await tmdbService.getMovieDetails(movie.id);
        
        // Buscar trailers
        const trailersResponse = await tmdbService.getMovieTrailers(movie.id);
        
        setDetails(movieDetails);
        setTrailers(trailersResponse.results || []);
      } catch (err) {
        console.error('Erro ao buscar detalhes:', err);
        setError('Erro ao carregar detalhes do filme');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id]);

  const handleToggleFavorite = () => {
    onToggleFavorite(movie);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getYouTubeEmbedUrl = (key) => {
    return `https://www.youtube.com/embed/${key}`;
  };

  if (loading) {
    return (
      <div className="movie-details-overlay" onClick={onClose}>
        <div className="movie-details-modal" onClick={e => e.stopPropagation()}>
          <div className="loading-details">
            <div className="loading-spinner"></div>
            <p>Carregando detalhes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-overlay" onClick={onClose}>
        <div className="movie-details-modal" onClick={e => e.stopPropagation()}>
          <div className="error-details">
            <h3>Erro ao carregar detalhes</h3>
            <p>{error}</p>
            <button onClick={onClose} className="close-btn">Fechar</button>
          </div>
        </div>
      </div>
    );
  }

  const mainTrailer = trailers.find(trailer => trailer.type === 'Trailer' && trailer.site === 'YouTube');
  const otherTrailers = trailers.filter(trailer => trailer.type === 'Trailer' && trailer.site === 'YouTube' && trailer !== mainTrailer);

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="movie-details-content">
          <div className="movie-details-header">
            <div className="movie-poster-large">
              <img
                src={tmdbService.getImageUrl(details?.poster_path || movie.poster_path, 'w500')}
                alt={movie.title}
              />
            </div>
            
            <div className="movie-info-large">
              <h1 className="movie-title-large">{movie.title}</h1>
              <div className="movie-meta">
                <span className="release-year">
                  {details?.release_date ? new Date(details.release_date).getFullYear() : 'N/A'}
                </span>
                <span className="runtime">{formatRuntime(details?.runtime)}</span>
                <div className="rating-large">
                  <span className="rating-star">⭐</span>
                  <span>{details?.vote_average?.toFixed(1) || movie.vote_average?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              
              <div className="genres">
                {details?.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
              
              <p className="overview-large">{details?.overview || movie.overview}</p>
              
              <div className="action-buttons">
                <button
                  className={`favorite-details-btn ${isFavorite ? 'favorited' : ''}`}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
                </button>
              </div>
            </div>
          </div>

          {mainTrailer && (
            <div className="trailer-section">
              <h3>Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={getYouTubeEmbedUrl(mainTrailer.key)}
                  title={`${movie.title} - Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {otherTrailers.length > 0 && (
            <div className="additional-trailers">
              <h3>Outros Trailers</h3>
              <div className="trailers-grid">
                {otherTrailers.slice(0, 3).map((trailer, index) => (
                  <div key={index} className="trailer-item">
                    <iframe
                      src={getYouTubeEmbedUrl(trailer.key)}
                      title={`${movie.title} - ${trailer.name}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <p className="trailer-name">{trailer.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details?.production_companies && details.production_companies.length > 0 && (
            <div className="production-info">
              <h3>Produção</h3>
              <div className="companies">
                {details.production_companies.map(company => (
                  <span key={company.id} className="company-tag">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
