import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tmdbService } from '../../services/tmdb';
import { youtubeService } from '../../services/youtube';
import './MovieDetails.css';

// Componente para exibir o elenco
const CastList = ({ cast }) => (
  <div className="cast-grid">
    {cast.slice(0, 10).map(person => (
      <div key={person.id} className="cast-card">
        <img 
          src={tmdbService.getImageUrl(person.profile_path, 'w185')} 
          alt={person.name} 
          className="cast-image"
        />
        <div className="cast-info">
          <h4>{person.name}</h4>
          <p>{person.character}</p>
        </div>
      </div>
    ))}
  </div>
);

// Componente para exibir os trailers
const Trailers = ({ videos, movieTitle, releaseDate }) => {
  const [trailers, setTrailers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        console.log('Iniciando busca por trailers...');
        
        // Primeiro tenta buscar trailers do TMDB
        const youtubeVideos = videos.results?.filter(video => 
          video.site === 'YouTube' && video.type === 'Trailer'
        ) || [];

        console.log('Trailers encontrados no TMDB:', youtubeVideos);

        // Se não encontrar trailers no TMDB, tenta buscar no YouTube
        if (youtubeVideos.length === 0) {
          console.log('Nenhum trailer encontrado no TMDB, buscando no YouTube...');
          try {
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
            const youtubeTrailer = await youtubeService.searchTrailer(movieTitle, year);
            
            if (youtubeTrailer) {
              console.log('Trailer encontrado no YouTube:', youtubeTrailer);
              // Garante que temos uma thumbnail
              const trailerWithFallback = {
                ...youtubeTrailer,
                thumbnail: youtubeTrailer.thumbnail || `https://img.youtube.com/vi/${youtubeTrailer.key}/maxresdefault.jpg`
              };
              setTrailers([trailerWithFallback]);
              setSelectedTrailer(trailerWithFallback);
            } else {
              console.log('Nenhum trailer encontrado no YouTube');
              setError('Nenhum trailer disponível para este filme.');
            }
          } catch (error) {
            console.error('Erro ao buscar trailer no YouTube:', error);
            setError('Não foi possível carregar os trailers. Tente novamente mais tarde.');
          }
        } else {
          console.log('Usando trailers do TMDB:', youtubeVideos);
          setTrailers(youtubeVideos);
          setSelectedTrailer(youtubeVideos[0]); // Seleciona o primeiro trailer por padrão
        }
      } catch (err) {
        console.error('Erro ao buscar trailers:', err);
        setError('Não foi possível carregar os trailers.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailers();
  }, [videos, movieTitle, releaseDate]);

  if (isLoading) {
    return <div className="loading-trailers">Carregando trailers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!selectedTrailer) {
    return (
      <div className="no-trailers">
        <p>Nenhum trailer oficial encontrado.</p>
        <p>
          Você pode tentar buscar no{' '}
          <a 
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' trailer')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="youtube-link"
          >
            YouTube <span className="external-icon">↗</span>
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="trailers-container">
      <div className="video-wrapper">
        <div className="video-container">
          <iframe
            width="100%"
            height="450"
            src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=0&rel=0&modestbranding=1`}
            title={selectedTrailer.name || 'Trailer do filme'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        {selectedTrailer.name && (
          <h4 className="video-title">{selectedTrailer.name}</h4>
        )}
      </div>
      
      {trailers.length > 1 && (
        <div className="trailer-thumbnails">
          {trailers.map((trailer, index) => (
            <button
              key={trailer.id || `trailer-${index}`}
              className={`thumbnail ${selectedTrailer.key === trailer.key ? 'active' : ''}`}
              onClick={() => setSelectedTrailer(trailer)}
              aria-label={`Selecionar trailer ${index + 1}`}
            >
              <img
                src={trailer.thumbnail || `https://img.youtube.com/vi/${trailer.key}/default.jpg`}
                alt={`Thumbnail do trailer ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para exibir avaliações
const Reviews = ({ reviews }) => {
  if (!reviews?.results?.length) return <p>Nenhuma avaliação disponível.</p>;

  return (
    <div className="reviews-container">
      {reviews.results.map(review => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <h4>{review.author}</h4>
            <span className="rating">
              {review.author_details.rating ? `${review.author_details.rating}/10` : 'Sem nota'}
            </span>
          </div>
          <p className="review-content">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

// Componente para exibir filmes similares
const SimilarMovies = ({ movies, onMovieSelect }) => {
  if (!movies?.results?.length) return <p>Nenhum filme similar encontrado.</p>;

  return (
    <div className="similar-movies">
      {movies.results.slice(0, 6).map(movie => (
        <div 
          key={movie.id} 
          className="similar-movie"
          onClick={() => onMovieSelect(movie)}
        >
          <img 
            src={tmdbService.getImageUrl(movie.poster_path, 'w185')} 
            alt={movie.title} 
          />
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
  );
};

const MovieDetails = ({ movie, onClose, onToggleFavorite, isFavorite, onMovieSelect }) => {
  const [details, setDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os detalhes do filme de uma vez
        const movieDetails = await tmdbService.getMovieDetails(movie.id);
        
        setDetails(movieDetails);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar detalhes do filme:', err);
        setError('Não foi possível carregar os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    if (movie) {
      fetchDetails();
    }

    return () => {
      setDetails(null);
      setError(null);
    };
  }, [movie]);

  const formatRuntime = (minutes) => {
    if (!minutes) return 'Duração não informada';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const renderContent = () => {
    if (loading) return <div className="loading">Carregando detalhes...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!details) return <div>Nenhum detalhe disponível</div>;

    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
      release_date,
      runtime,
      genres = [],
      credits = {},
      videos = {},
      similar = {},
      reviews = {}
    } = details;

    const director = credits.crew?.find(person => person.job === 'Director');
    const youtubeTrailer = videos.results?.find(video => 
      video.site === 'YouTube' && video.type === 'Trailer'
    );

    return (
      <div className="movie-details-container">
        {/* Cabeçalho com imagem de fundo */}
        <div 
          className="movie-backdrop"
          style={{
            backgroundImage: `url(${tmdbService.getImageUrl(backdrop_path, 'original')})`
          }}
        >
          <div className="backdrop-overlay">
            <div className="movie-header">
              <div className="movie-poster">
                <img 
                  src={tmdbService.getImageUrl(poster_path, 'w342')} 
                  alt={title} 
                />
                <div className="favorite-text-details" 
                  onClick={onToggleFavorite}
                  title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </div>
              </div>
              
              <div className="movie-info">
                <h1>{title} <span>({new Date(release_date).getFullYear()})</span></h1>
                
                <div className="movie-meta">
                  <span className="rating">
                    ★ {vote_average?.toFixed(1)}/10
                  </span>
                  <span>{formatDate(release_date)}</span>
                  <span>{formatRuntime(runtime)}</span>
                  <span>{genres.map(g => g.name).join(', ')}</span>
                </div>
                
                {director && (
                  <p className="director">
                    <strong>Diretor:</strong> {director.name}
                  </p>
                )}
                
                {(youtubeTrailer || credits.cast?.length > 0) && (activeTab === 'trailers' || activeTab === 'cast') && (
                  <div className="trailer-cast-container">
                    {/* Seção do Trailer */}
                    {youtubeTrailer && activeTab === 'trailers' && (
                      <div className="trailer-wrapper">
                        <h3>Trailer</h3>
                        <Trailers 
                          videos={videos} 
                          movieTitle={title} 
                          releaseDate={release_date} 
                        />
                      </div>
                    )}

                    {/* Seção do Elenco */}
                    {credits.cast?.length > 0 && (
                      <div className="cast-sidebar">
                        <h3>Elenco Principal</h3>
                        <CastList cast={credits.cast.slice(0, 6)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Abas de navegação */}
        <div className="tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={activeTab === 'cast' ? 'active' : ''}
            onClick={() => setActiveTab('cast')}
          >
            Elenco
          </button>
          <button 
            className={activeTab === 'trailers' ? 'active' : ''}
            onClick={() => setActiveTab('trailers')}
          >
            Trailers
          </button>
          <button 
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Avaliações
          </button>
          <button 
            className={activeTab === 'similar' ? 'active' : ''}
            onClick={() => setActiveTab('similar')}
          >
            Filmes Similares
          </button>
        </div>
        
        {/* Conteúdo das abas */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <h2>Sinopse</h2>
              <p>{overview || 'Sinopse não disponível.'}</p>
              
              <div className="details-grid">
                <div className="detail-item">
                  <h3>Data de Lançamento</h3>
                  <p>{formatDate(release_date)}</p>
                </div>
                <div className="detail-item">
                  <h3>Duração</h3>
                  <p>{formatRuntime(runtime)}</p>
                </div>
                <div className="detail-item">
                  <h3>Gêneros</h3>
                  <p>{genres.map(g => g.name).join(', ') || 'Não especificado'}</p>
                </div>
                <div className="detail-item">
                  <h3>Classificação</h3>
                  <p>{details.release_dates?.results?.find(d => d.iso_3166_1 === 'BR')?.release_dates[0]?.certification || 'Não classificado'}</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'cast' && credits.cast && (
            <CastList cast={credits.cast} />
          )}
          
          {activeTab === 'trailers' && (
            <Trailers 
              videos={details.videos} 
              movieTitle={details.title}
              releaseDate={details.release_date}
            />
          )}
          
          {activeTab === 'reviews' && (
            <Reviews reviews={reviews} />
          )}
          
          {activeTab === 'similar' && (
            <div className="similar-section">
              <h2>Filmes Similares</h2>
              <SimilarMovies 
                movies={similar} 
                onMovieSelect={onMovieSelect} 
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!movie) return null;

  if (loading) {
    return (
      <div className="movie-details-loading">
        <div className="loading-spinner"></div>
        <p>Carregando detalhes do filme...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-error">
        <p>{error}</p>
        <button onClick={onClose} className="close-button">
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Fechar">
          &times;
        </button>

        <div className="movie-details-content">
          <div className="movie-details-poster">
            <img 
              src={details.poster_path 
                ? tmdbService.getImageUrl(details.poster_path, 'w500') 
                : 'https://via.placeholder.com/300x450?text=Poster+Not+Available'}
              alt={details.title}
            />
            <div className="movie-actions">
              <button 
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                onClick={() => onToggleFavorite(movie)}
              >
                {isFavorite ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
              </button>
            </div>
          </div>

          <div className="movie-details-info">
            <h2>{details.title} <span>({new Date(details.release_date).getFullYear()})</span></h2>
            
            <div className="movie-meta">
              {details.release_date && (
                <span className="release-date">{formatDate(details.release_date)}</span>
              )}
              {details.runtime > 0 && (
                <span className="runtime">{formatRuntime(details.runtime)}</span>
              )}
              <span className="rating">
                ⭐ {details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}/10
              </span>
            </div>

            <div className="genres">
              {details.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>

            <div className="overview">
              <h3>Sinopse</h3>
              <p>{details.overview || 'Sinopse não disponível.'}</p>
            </div>

            {details.tagline && (
              <p className="tagline">"{details.tagline}"</p>
            )}

            {details.videos?.results?.length > 0 && (
              <div className="trailers">
                <h3>Trailers</h3>
                <div className="trailer-list">
                  {details.videos.results
                    .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
                    .slice(0, 2)
                    .map(trailer => (
                      <div key={trailer.id} className="trailer-item">
                        <h4>{trailer.name}</h4>
                        <div className="video-container">
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={trailer.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

MovieDetails.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default MovieDetails;
