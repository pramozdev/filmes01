import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart, FaStar, FaTimes, FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { tmdbService } from '../../services/tmdb';
import './MovieCard.css';

// Componente de confete
const Confetti = ({ count = 20 }) => {
  const confettiRef = useRef([]);
  
  useEffect(() => {
    if (confettiRef.current.length > 0) {
      const timer = setTimeout(() => {
        confettiRef.current = [];
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [confettiRef.current.length]);

  if (confettiRef.current.length === 0) return null;

  return (
    <div className="confetti-container">
      {Array(count).fill().map((_, i) => (
        <div
          key={i}
          ref={el => confettiRef.current[i] = el}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            background: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}
        />
      ))}
    </div>
  );
};

// Componente de placeholder para carregamento
const SkeletonLoader = () => (
  <div className="skeleton-loader">
    <div className="skeleton-poster"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-meta"></div>
    </div>
  </div>
);

const MovieCard = memo(({ movie, isFavorite = false, onToggleFavorite, onShowDetails, isExpanded = false }) => {
  const [cast, setCast] = useState([]);
  const [isLoadingCast, setIsLoadingCast] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (isExpanded && movie.id) {
        try {
          setIsLoadingCast(true);
          // Busca os créditos do filme
          const credits = await tmdbService.getMovieCredits(movie.id);
          setCast(credits);
          
          // Se o filme não tiver todos os detalhes, busca os detalhes completos
          if (!movie.runtime || !movie.genres) {
            const details = await tmdbService.getMovieDetails(movie.id);
            setMovieDetails(details);
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do filme:', error);
        } finally {
          setIsLoadingCast(false);
        }
      }
    };

    fetchMovieDetails();
  }, [movie.id, isExpanded, movie.runtime, movie.genres]);

  const handleToggleFavorite = useCallback((e) => {
    e.stopPropagation();
    
    // Efeito de confete apenas ao adicionar aos favoritos
    if (!isFavorite) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1000);
    }
    
    // Chama a função de toggle em todos os casos
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  }, [movie, onToggleFavorite, isFavorite]);

  const handleShowDetails = useCallback(() => {
    if (onShowDetails) {
      onShowDetails(movie);
    }
  }, [movie, onShowDetails]);
  
  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const cardClass = `movie-card ${isExpanded ? 'expanded' : ''} ${isImageLoaded ? 'loaded' : 'loading'}`;
  const favoriteButtonClass = `favorite-button ${isFavorite ? 'favorited' : ''} ${isHovered ? 'hovered' : ''}`;

  // Se estiver carregando, retorna o skeleton loader
  if (!movie) {
    return <SkeletonLoader />;
  }

  return (
    <div 
      className={cardClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Filme: ${movie.title}`}
      role="article"
    >
      {/* Botão de favorito */}
      <div className="favorite-button-container" ref={buttonRef}>
        <button 
          className={favoriteButtonClass}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          data-tooltip={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite ? (
            <FaHeart className="heart-icon" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
          <span>{isFavorite ? 'Favorito' : 'Favoritar'}</span>
        </button>
        {showConfetti && <Confetti count={15} />}
      </div>

      {/* Poster do filme */}
      <div 
        className="movie-poster" 
        onClick={handleShowDetails}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleShowDetails()}
      >
        <img
          src={movie.poster_path ? tmdbService.getImageUrl(movie.poster_path, 'w500') : 'https://via.placeholder.com/500x750?text=Sem+Imagem'}
          alt={`Poster de ${movie.title}`}
          onLoad={handleImageLoad}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/500x750?text=Sem+Imagem';
          }}
          loading="lazy"
        />
        
        {/* Overlay de hover */}
        <div className={`movie-overlay ${isHovered ? 'visible' : ''}`}>
          <div className="play-button">
            <FaPlay />
          </div>
          <p>Ver detalhes</p>
        </div>
        
        {/* Avaliação */}
        <div className="movie-rating">
          <FaStar className="rating-icon" />
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
        </div>
        
        {isExpanded && (
          <button 
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              if (onShowDetails) {
                onShowDetails(null);
              }
            }}
            aria-label="Fechar detalhes"
            title="Fechar"
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      {/* Conteúdo do card */}
      <div className="movie-content">
        <div 
          className="movie-header" 
          onClick={handleShowDetails}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleShowDetails()}
        >
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            {movie.genres && movie.genres.length > 0 && (
              <span className="movie-genres">
                {movie.genres.slice(0, 2).map(g => g.name).join(' • ')}
                {movie.genres.length > 2 && '...'}
              </span>
            )}
          </div>
        </div>
        
        {/* Detalhes expandidos */}
        {isExpanded && (
          <div className="expanded-details">
            {/* Metadados detalhados */}
            <div className="movie-meta-details">
              <div className="meta-item">
                <span className="meta-label">Ano de Lançamento</span>
                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
              </div>
              
              {movieDetails?.runtime && (
                <div className="meta-item">
                  <span className="meta-label">Duração</span>
                  <span>{`${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`}</span>
                </div>
              )}
              
              {(movie.genres || movieDetails?.genres) && (
                <div className="meta-item">
                  <span className="meta-label">Gêneros</span>
                  <span>{(movie.genres || movieDetails.genres || []).map(g => g.name).join(', ')}</span>
                </div>
              )}
              
              {movieDetails?.production_countries && movieDetails.production_countries.length > 0 && (
                <div className="meta-item">
                  <span className="meta-label">País</span>
                  <span>{movieDetails.production_countries[0].name}</span>
                </div>
              )}
            </div>
            
            {/* Sinopse */}
            {movie.overview && (
              <div className="movie-synopsis">
                <h4>Sinopse</h4>
                <p>{movie.overview}</p>
              </div>
            )}
            
            {/* Elenco */}
            <div className="movie-cast">
              <h4>Elenco Principal</h4>
              {isLoadingCast ? (
                <div className="cast-loading">Carregando elenco...</div>
              ) : cast.length > 0 ? (
                <div className="cast-grid">
                  {cast.slice(0, 6).map(actor => (
                    <div key={actor.id} className="cast-member">
                      <div className="cast-photo">
                        <img 
                          src={actor.profile_path 
                            ? tmdbService.getImageUrl(actor.profile_path, 'w185')
                            : 'https://via.placeholder.com/185x278?text=Sem+Foto'}
                          alt={actor.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/185x278?text=Sem+Foto';
                          }}
                        />
                      </div>
                      <div className="cast-details">
                        <span className="cast-name" title={actor.name}>
                          {actor.name}
                        </span>
                        <span className="cast-character" title={actor.character}>
                          {actor.character}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-cast">Elenco não disponível</div>
              )}
            </div>
            
            {/* Botão de ação */}
            <div className="action-buttons">
              <button 
                className="watch-trailer"
                onClick={() => {
                  // Lógica para assistir trailer
                  console.log('Assistir trailer de', movie.title);
                }}
              >
                <FaPlay /> Assistir Trailer
              </button>
              
              <button 
                className="favorite-button"
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                {isFavorite ? (
                  <>
                    <FaCheck /> Remover dos Favoritos
                  </>
                ) : (
                  <>
                    <FaPlus /> Adicionar aos Favoritos
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Resumo (visão compactada) */}
        {!isExpanded && movie.overview && (
          <p 
            className="movie-overview" 
            onClick={handleShowDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleShowDetails()}
          >
            {movie.overview.length > 120 
              ? `${movie.overview.substring(0, 120)}...` 
              : movie.overview}
            <span className="read-more">Leia mais</span>
          </p>
        )}
      </div>
    </div>
  );
});

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    backdrop_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    vote_count: PropTypes.number,
    overview: PropTypes.string,
    genres: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    ),
    runtime: PropTypes.number,
    status: PropTypes.string,
    tagline: PropTypes.string,
    production_companies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        logo_path: PropTypes.string,
        origin_country: PropTypes.string
      })
    ),
    production_countries: PropTypes.arrayOf(
      PropTypes.shape({
        iso_3166_1: PropTypes.string,
        name: PropTypes.string
      })
    ),
    spoken_languages: PropTypes.arrayOf(
      PropTypes.shape({
        english_name: PropTypes.string,
        iso_639_1: PropTypes.string,
        name: PropTypes.string
      })
    )
  }),
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  onShowDetails: PropTypes.func,
  isExpanded: PropTypes.bool
};

MovieCard.defaultProps = {
  isFavorite: false,
  onToggleFavorite: () => {},
  onShowDetails: null,
  isExpanded: false
};

export default MovieCard;
